import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useState } from "react";

import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createCheckoutSession } from "@/lib/payments.functions";

interface StripeEmbeddedCheckoutProps {
  priceId: string;
  customerEmail: string;
  bookingId: string;
  slotId: string;
  sessionDate: string | null;
  bookingType: "trial" | "subscription" | "card5" | "card10";
  className?: string;
}

export function StripeEmbeddedCheckout({
  priceId,
  customerEmail,
  bookingId,
  slotId,
  sessionDate,
  bookingType,
  className,
}: StripeEmbeddedCheckoutProps) {
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = async (): Promise<string> => {
    const result = await createCheckoutSession({
      data: {
        priceId,
        customerEmail,
        bookingId,
        slotId,
        sessionDate,
        bookingType,
        returnUrl: `${window.location.origin}/paiement/retour?session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
      },
    });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
    return result.clientSecret;
  };

  // Après paiement, Stripe redirige lui-même vers return_url
  // (/paiement/retour?session_id=…). Aucun onComplete : une navigation
  // concurrente casserait la redirection du formulaire.
  if (error) {
    return (
      <div className={className}>
        <p className="rounded-md border border-primary/50 bg-primary/10 p-4 text-sm text-foreground">
          Le formulaire de paiement n'a pas pu s'ouvrir. Ta place reste bloquée 30 minutes : réessaie
          depuis ce même panneau, ou écris-nous à unlok.basketball@gmail.com.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <EmbeddedCheckoutProvider
        stripe={getStripe()}
        options={{
          fetchClientSecret: async () => {
            try {
              return await fetchClientSecret();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Erreur de paiement");
              throw e;
            }
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
