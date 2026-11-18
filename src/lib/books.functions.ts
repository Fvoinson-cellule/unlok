import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import { BOOKS, BOOK_PACK, bookPriceCents, isBookProduct, type BookProduct } from "@/lib/pricing";

type Download = { label: string; url: string; filename: string };

function cookieName(product: BookProduct) {
  return `book_${product}_cs`;
}

export const createBookCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: { product: string; email: string; returnUrl: string; environment: StripeEnv }) => {
    if (!isBookProduct(data.product)) throw new Error("Invalid product");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) throw new Error("Invalid email");
    if (!/^https?:\/\//.test(data.returnUrl)) throw new Error("Invalid returnUrl");
    if (data.environment !== "sandbox" && data.environment !== "live") throw new Error("Invalid env");
    return { ...data, product: data.product, email: data.email.trim().toLowerCase().slice(0, 100) };
  })
  .handler(async ({ data }): Promise<{ clientSecret: string } | { error: string }> => {
    const { assertSameOrigin } = await import("@/lib/return-url.server");
    assertSameOrigin(data.returnUrl);
    try {
      const product = data.product;
      const name = product === "pack" ? BOOK_PACK.checkoutName : BOOKS[product].checkoutName;
      const stripe = createStripeClient(data.environment);
      const session = await stripe.checkout.sessions.create({
        line_items: [{
          price_data: { currency: "eur", product_data: { name }, unit_amount: bookPriceCents(product) },
          quantity: 1,
        }],
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer_email: data.email,
        payment_intent_data: { description: name },
        metadata: { product },
      } as Parameters<typeof stripe.checkout.sessions.create>[0]);
      // Lie ce paiement au navigateur de l'acheteur avant d'autoriser le téléchargement.
      setCookie(cookieName(product), session.id, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

// Les PDF complets ne sont renvoyés qu'après vérification du paiement et du cookie de l'acheteur.
export const getBookDownload = createServerFn({ method: "POST" })
  .inputValidator((data: { product: string; sessionId: string; environment: StripeEnv }) => {
    if (!isBookProduct(data.product)) throw new Error("Invalid product");
    if (!/^cs_[A-Za-z0-9_-]{10,}$/.test(data.sessionId)) throw new Error("Invalid sessionId");
    if (data.environment !== "sandbox" && data.environment !== "live") throw new Error("Invalid env");
    return { ...data, product: data.product };
  })
  .handler(async ({ data }): Promise<{ downloads: Download[] } | { error: string }> => {
    try {
      const product = data.product;
      // ramp_cs permet aux anciens liens de retour du Book RAMP de continuer à fonctionner.
      const boundSession = getCookie(cookieName(product)) ?? (product === "ramp" ? getCookie("ramp_cs") : undefined);
      if (boundSession !== data.sessionId) return { error: "forbidden" };
      const stripe = createStripeClient(data.environment);
      const session = await stripe.checkout.sessions.retrieve(data.sessionId);
      if (session.metadata?.["product"] !== product) return { error: "wrong_product" };
      if (session.payment_status === "unpaid") return { error: "unpaid" };

      const downloads: Download[] = [];
      if (product === "ramp" || product === "pack") {
        const asset = (await import("@/assets/Pack-RAMP-Unlok.pdf.asset.json")).default;
        downloads.push({ label: "Book RAMP · 40 échauffements", url: asset.url, filename: "Pack-RAMP-Unlok.pdf" });
      }
      if (product === "tir" || product === "pack") {
        const asset = (await import("@/assets/Book-Tir-Unlok.pdf.asset.json")).default;
        downloads.push({ label: "Book Tir · 30 exercices", url: asset.url, filename: "Book-Tir-Unlok.pdf" });
      }
      return { downloads };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
