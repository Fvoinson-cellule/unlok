import { createServerFn } from "@tanstack/react-start";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import { rampPriceCents } from "@/lib/pricing";
import { getCookie, setCookie } from "@tanstack/react-start/server";

const NAME = "Book RAMP UNLOK · 40 échauffements (PDF)";

export const createRampCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; returnUrl: string; environment: StripeEnv }) => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) throw new Error("Invalid email");
    if (!/^https?:\/\//.test(data.returnUrl)) throw new Error("Invalid returnUrl");
    if (data.environment !== "sandbox" && data.environment !== "live") throw new Error("Invalid env");
    return { ...data, email: data.email.trim().slice(0, 100) };
  })
  .handler(async ({ data }): Promise<{ clientSecret: string } | { error: string }> => {
    const { assertSameOrigin } = await import("@/lib/return-url.server");
    assertSameOrigin(data.returnUrl);
    try {
      const stripe = createStripeClient(data.environment);
      const session = await stripe.checkout.sessions.create({
        line_items: [{
          price_data: { currency: "eur", product_data: { name: NAME }, unit_amount: rampPriceCents() },
          quantity: 1,
        }],
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer_email: data.email,
        payment_intent_data: { description: NAME },
        metadata: { product: "ramp" },
      } as Parameters<typeof stripe.checkout.sessions.create>[0]);
      // Lie la session de paiement au navigateur de l'acheteur.
      setCookie("ramp_cs", session.id, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

// Ne renvoie le lien du PDF qu'après vérification du paiement auprès de Stripe.
export const getRampDownload = createServerFn({ method: "POST" })
  .inputValidator((data: { sessionId: string; environment: StripeEnv }) => {
    if (!/^cs_[A-Za-z0-9_-]{10,}$/.test(data.sessionId)) throw new Error("Invalid sessionId");
    if (data.environment !== "sandbox" && data.environment !== "live") throw new Error("Invalid env");
    return data;
  })
  .handler(async ({ data }): Promise<{ url: string } | { error: string }> => {
    try {
      if (getCookie("ramp_cs") !== data.sessionId) return { error: "forbidden" };
      const stripe = createStripeClient(data.environment);
      const s = await stripe.checkout.sessions.retrieve(data.sessionId);
      if (s.metadata?.['product'] !== "ramp") return { error: "not_ramp" };
      if (s.payment_status === "unpaid") return { error: "unpaid" };
      const asset = (await import("@/assets/Pack-RAMP-Unlok.pdf.asset.json")).default;
      return { url: asset.url };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
