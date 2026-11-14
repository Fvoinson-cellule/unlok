import { createServerFn } from "@tanstack/react-start";

// Enregistre l'email (groupe Coachs) puis renvoie le lien de l'extrait gratuit.
export const getFreeEbook = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => {
    const email = String(data?.email ?? "").trim().toLowerCase().slice(0, 200);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Invalid email");
    return { email };
  })
  .handler(async ({ data }): Promise<{ url: string } | { error: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("customers").upsert(
      { segment: "coach", email: data.email, detail: "Extrait gratuit RAMP (défense)", source_id: `free-ramp:${data.email}` },
      { onConflict: "source_id" },
    );
    if (error) {
      console.error("free ebook insert", error);
      return { error: "save_failed" };
    }
    const asset = (await import("@/assets/Echauffement-defensif-RAMP-Unlok.pdf.asset.json")).default;
    return { url: asset.url };
  });
