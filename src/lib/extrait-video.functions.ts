import { createServerFn } from "@tanstack/react-start";
import { videoLeadSchema } from "./extrait-video.schema";

export const unlockTirVideo = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => videoLeadSchema.parse(input))
  .handler(async ({ data }): Promise<{ success: true } | { error: string }> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      // Les tables existantes n'ont pas de colonne de consentement : preuve datée dans detail.
      const detail = `Extrait vidéo Book Tir · ${data.src} · Consentement emails Florian (Unlok) : oui · ${new Date().toISOString()}`;
      const { error } = await supabaseAdmin.from("customers").upsert({
        segment: "coach", email: data.email, detail, source_id: `video-tir:${data.email}`,
      }, { onConflict: "source_id" });
      if (error) return { error: "L'envoi n'a pas fonctionné. Réessaie dans un instant." };
      return { success: true };
    } catch {
      return { error: "L'envoi n'a pas fonctionné. Réessaie dans un instant." };
    }
  });