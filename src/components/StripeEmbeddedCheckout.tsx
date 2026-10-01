import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Component, useState, type ReactNode } from "react";

import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createCheckoutSession } from "@/lib/payments.functions";

type BookingType = "trial" | "subscription" | "card5" | "card10";

interface StripeEmbeddedCheckoutProps {
  priceId: string;
  customerEmail: string;
  bookingId: string;
  slotId: string;
  sessionDate: string | null;
  bookingType: BookingType;
  className?: string;
}

// Liens de paiement Stripe existants, utilisés quand le paiement intégré
// ne peut pas s'ouvrir (site statique, réseau, configuration absente).
const FALLBACK_LINKS: Record<string, string> = {
  unlok_trial_once: "https://buy.stripe.com/14AfZh3nB50l2f00hU6sw04",
  unlok_subscription_monthly: "https://buy.stripe.com/00w6oHf6jfEZbPA0hU6sw06",
  unlok_card5_once: "https://buy.stripe.com/fZu14n5vJ78t9Hsd4G6sw01",
  unlok_card10_once: "https://buy.stripe.com/cNidR9gancsN1aWaWy6sw02",
};

function canEmbed(): boolean {
  try {
    getStripeEnvironment();
    return true;
  } catch {
    return false;
  }
}

function Fallback({ priceId, email }: { priceId: string; email: string }) {
  const base = FALLBACK_LINKS[priceId];
  const href = base ? `${base}?prefilled_email=${encodeURIComponent(email)}` : null;
  return (
    <div className="rounded-md border border-primary/50 bg-primary/10 p-4 text-sm text-foreground">
      <p>Ta place est bloquée 30 minutes. Finalise ton paiement sur la page sécurisée Stripe.</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex rounded-md bg-primary px-4 py-2 font-medium uppercase text-primary-foreground"
        >
          Payer sur Stripe →
        </a>
      ) : (
        <p className="mt-2">
          Écris-nous à{" "}
          <a className="underline" href="mailto:unlok.basketball@gmail.com">
            unlok.basketball@gmail.com
          </a>{" "}
          pour recevoir ton lien de paiement.
        </p>
      )}
    </div>
  );
}

class CheckoutBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("Checkout error:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function StripeEmbeddedCheckout(props: StripeEmbeddedCheckoutProps) {
  const { priceId, customerEmail, className } = props;
  const [error, setError] = useState(false);
  const fallback = <Fallback priceId={priceId} email={customerEmail} />;

  if (error || !canEmbed()) return <div className={className}>{fallback}</div>;

  const fetchClientSecret = async (): Promise<string> => {
    try {
      const result = await createCheckoutSession({
        data: {
          priceId,
          customerEmail,
          bookingId: props.bookingId,
          slotId: props.slotId,
          sessionDate: props.sessionDate,
          bookingType: props.bookingType,
          returnUrl: `${window.location.origin}/paiement/retour?session_id={CHECKOUT_SESSION_ID}`,
          environment: getStripeEnvironment(),
        },
      });
      if ("error" in result) throw new Error(result.error);
      if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
      return result.clientSecret;
    } catch (e) {
      console.error("Checkout session error:", e);
      setError(true);
      throw e;
    }
  };

  // Après paiement, Stripe redirige lui-même vers return_url.
  return (
    <div className={className}>
      <CheckoutBoundary fallback={fallback}>
        <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </CheckoutBoundary>
    </div>
  );
}
