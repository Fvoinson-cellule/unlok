import { describe, expect, it } from "vitest";
import { videoLeadSchema, videoSource } from "./extrait-video.schema";

describe("accès à l'extrait vidéo Tir", () => {
  it("refuse un email invalide", () => {
    expect(videoLeadSchema.safeParse({ email: "invalide", consent: true, src: "instagram" }).success).toBe(false);
  });
  it("exige le consentement explicite", () => {
    expect(videoLeadSchema.safeParse({ email: "coach@example.com", consent: false, src: "instagram" }).success).toBe(false);
  });
  it("normalise l'email en minuscules", () => {
    expect(videoLeadSchema.parse({ email: " Coach@Example.com ", consent: true, src: "linkedin" }).email).toBe("coach@example.com");
  });
  it("accepte les quatre sources autorisées et refuse les autres au serveur", () => {
    for (const src of ["instagram", "linkedin", "facebook", "autre"]) {
      expect(videoLeadSchema.safeParse({ email: "coach@example.com", consent: true, src }).success).toBe(true);
    }
    expect(videoLeadSchema.safeParse({ email: "coach@example.com", consent: true, src: "inconnu" }).success).toBe(false);
  });
  it("transforme les sources inconnues de l'URL en autre", () => {
    expect(videoSource("inconnu")).toBe("autre");
    expect(videoSource(undefined)).toBe("autre");
    expect(videoSource("facebook")).toBe("facebook");
  });
});