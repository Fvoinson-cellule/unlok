import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
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
  return (
    <div className={className}>
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
