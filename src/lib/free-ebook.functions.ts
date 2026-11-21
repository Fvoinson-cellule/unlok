import { createServerFn } from "@tanstack/react-start";

// Enregistre l'email dans le groupe Coachs puis renvoie l'extrait demandé.
export const getFreeEbook = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; book?: string }) => {
    const email = String(data?.email ?? "").trim().toLowerCase().slice(0, 200);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Invalid email");
    const book = data.book ?? "ramp";
    if (book !== "ramp") throw new Error("Invalid book");
    return { email, book };
  })
  .handler(async ({ data }): Promise<{ url: string } | { error: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const detail = "Extrait gratuit RAMP (défense)";
    const { error } = await supabaseAdmin.from("customers").upsert(
      { segment: "coach", email: data.email, detail, source_id: `free-${data.book}:${data.email}` },
      { onConflict: "source_id" },
    );
    if (error) {
      console.error("free ebook insert", error);
      return { error: "save_failed" };
    }
    const asset = (await import("@/assets/Echauffement-defensif-RAMP-Unlok.pdf.asset.json")).default;
    return { url: asset.url };
  });
