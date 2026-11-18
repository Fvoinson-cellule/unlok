import { createFileRoute, redirect } from "@tanstack/react-router";

// Ancienne adresse du Book RAMP : conserve notamment les retours de paiement existants.
export const Route = createFileRoute("/ramp")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string | undefined } => ({
    session_id: typeof search["session_id"] === "string" ? search["session_id"] : undefined,
  }),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/coach",
      search: { book: "ramp", product: "ramp", session_id: search.session_id },
      statusCode: 301,
    });
  },
});
