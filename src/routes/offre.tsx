import { createFileRoute, redirect } from "@tanstack/react-router";

// Ancienne adresse : redirige vers la page Tarifs.
export const Route = createFileRoute("/offre")({
  beforeLoad: () => {
    throw redirect({ to: "/tarifs", statusCode: 301 });
  },
});
