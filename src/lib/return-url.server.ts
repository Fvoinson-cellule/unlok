import { getRequest } from "@tanstack/react-start/server";

// Le retour après paiement doit rester sur le site qui a lancé le paiement.
export function assertSameOrigin(returnUrl: string) {
  let target: URL;
  try { target = new URL(returnUrl); } catch { throw new Error("Invalid returnUrl"); }
  const req = getRequest();
  const origin = req?.headers.get("origin") ?? (req ? new URL(req.url).origin : null);
  if (!origin || target.origin !== origin) throw new Error("Invalid returnUrl");
}
