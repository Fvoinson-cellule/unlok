import { createServerFn } from "@tanstack/react-start";

function check(code: unknown) {
  const expected = process.env["ADMIN_CODE"];
  if (!expected || typeof code !== "string" || code !== expected) throw new Error("Code incorrect");
}

export const getAdminData = createServerFn({ method: "POST" })
  .inputValidator((d: { code: string }) => d)
  .handler(async ({ data }) => {
    check(data.code);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [c, r] = await Promise.all([
      supabaseAdmin.from("customers").select("*").order("created_at", { ascending: false }).limit(5000),
      supabaseAdmin.from("reviews").select("*").order("created_at", { ascending: false }).limit(500),
    ]);
    return { customers: c.data ?? [], reviews: r.data ?? [] };
  });

export const moderateReview = createServerFn({ method: "POST" })
  .inputValidator((d: { code: string; id: string; action: "approve" | "hide" | "delete" }) => {
    if (!/^[0-9a-f-]{36}$/i.test(d.id)) throw new Error("id");
    return d;
  })
  .handler(async ({ data }) => {
    check(data.code);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const q = supabaseAdmin.from("reviews");
    const { error } = data.action === "delete"
      ? await q.delete().eq("id", data.id)
      : await q.update({ approved: data.action === "approve" }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
