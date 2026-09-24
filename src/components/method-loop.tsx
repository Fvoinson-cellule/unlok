import { useEffect, useRef, useState } from "react";

/**
 * Boucle de la méthode Unlok — reprise du schéma d'origine du site.
 * Trois étapes en cercle : réagir plus vite, faire le bon choix, ancrer durablement.
 */
export function MethodLoop() {
  const ref = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="-80 0 760 520"
      className={`method-loop w-full max-w-2xl ${visible ? "is-visible" : ""}`}
      role="img"
      aria-label="Boucle de la méthode Unlok : réagir plus vite, faire le bon choix, ancrer durablement"
    >
      {/* Cercle de fond */}
      <circle
        cx="300"
        cy="250"
        r="150"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="2"
      />

      {/* Arcs orange */}
      <g className="method-loop__arcs">
        <path
          d="M 368.1 116.3 A 150 150 0 0 1 449.8 257.9"
          fill="none"
          stroke="var(--color-primary)"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <polygon fill="var(--color-primary)" points="449.3,267.8 456.9,255.2 443.0,254.5" />
        <path
          d="M 381.7 375.8 A 150 150 0 0 1 218.3 375.8"
          fill="none"
          stroke="var(--color-primary)"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <polygon fill="var(--color-primary)" points="209.9,370.4 217.0,383.3 224.6,371.6" />
        <path
          d="M 150.2 257.9 A 150 150 0 0 1 231.9 116.3"
          fill="none"
          stroke="var(--color-primary)"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <polygon fill="var(--color-primary)" points="240.8,111.8 226.1,111.5 232.4,123.9" />
      </g>

      {/* Coeur du schéma */}
      <g className="method-loop__core" fontFamily="var(--font-display)">
        <text x="300" y="226" textAnchor="middle" fontSize="34" fontWeight="700" fill="var(--color-primary)">
          + VITE
        </text>
        <text x="300" y="260" textAnchor="middle" fontSize="34" fontWeight="700" fill="currentColor">
          + JUSTE
        </text>
        <text x="300" y="294" textAnchor="middle" fontSize="34" fontWeight="700" fill="var(--color-primary)">
          + DURABLE
        </text>
      </g>

      {/* Étape 1 */}
      <g className="method-loop__node" style={{ transitionDelay: "0.15s" }}>
        <circle cx="300" cy="100" r="30" fill="var(--color-background)" stroke="var(--color-primary)" strokeWidth="3" />
        <text x="300" y="110" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="var(--font-display)">
          1
        </text>
        <text x="300" y="32" textAnchor="middle" fontSize="19" fontWeight="600" fill="currentColor" fontFamily="var(--font-display)">
          RÉAGIR
        </text>
        <text x="300" y="54" textAnchor="middle" fontSize="19" fontWeight="600" fill="currentColor" fontFamily="var(--font-display)">
          PLUS VITE
        </text>
      </g>

      {/* Étape 2 */}
      <g className="method-loop__node" style={{ transitionDelay: "0.3s" }}>
        <circle cx="429.9" cy="325" r="30" fill="var(--color-background)" stroke="var(--color-primary)" strokeWidth="3" />
        <text x="429.9" y="335" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="var(--font-display)">
          2
        </text>
        <text x="560" y="356" textAnchor="middle" fontSize="19" fontWeight="600" fill="currentColor" fontFamily="var(--font-display)">
          FAIRE LE
        </text>
        <text x="560" y="378" textAnchor="middle" fontSize="19" fontWeight="600" fill="currentColor" fontFamily="var(--font-display)">
          BON CHOIX
        </text>
      </g>

      {/* Étape 3 */}
      <g className="method-loop__node" style={{ transitionDelay: "0.45s" }}>
        <circle cx="170.1" cy="325" r="30" fill="var(--color-background)" stroke="var(--color-primary)" strokeWidth="3" />
        <text x="170.1" y="335" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="var(--font-display)">
          3
        </text>
        <text x="40" y="356" textAnchor="middle" fontSize="19" fontWeight="600" fill="currentColor" fontFamily="var(--font-display)">
          ANCRER
        </text>
        <text x="40" y="378" textAnchor="middle" fontSize="19" fontWeight="600" fill="currentColor" fontFamily="var(--font-display)">
          DURABLEMENT
        </text>
      </g>
    </svg>
  );
}
