import { describe, expect, it } from "vitest";
import { isRampLaunch, orderTotal, pricePerPerson } from "./pricing";

describe("grille tarifaire", () => {
  it("individuel : 50 / 240 / 450", () => {
    expect(pricePerPerson("seance", 1)).toBe(50);
    expect(pricePerPerson("carte5", 1)).toBe(240);
    expect(pricePerPerson("carte10", 1)).toBe(450);
  });
  it("duo : 40 / 190 / 350 par personne", () => {
    expect(pricePerPerson("seance", 2)).toBe(40);
    expect(pricePerPerson("carte5", 2)).toBe(190);
    expect(pricePerPerson("carte10", 2)).toBe(350);
  });
  it("petit groupe : 35 / 165 / 300 par personne", () => {
    expect(pricePerPerson("seance", 3)).toBe(35);
    expect(pricePerPerson("carte5", 4)).toBe(165);
    expect(pricePerPerson("carte10", 4)).toBe(300);
  });
  it("séance d'essai à 15 € par personne", () => {
    expect(orderTotal("essai", 3)).toBe(45);
  });
  it("book RAMP : lancement jusqu'au 31 décembre", () => {
    expect(isRampLaunch(new Date("2026-12-31T22:00:00+01:00"))).toBe(true);
    expect(isRampLaunch(new Date("2027-01-01T00:30:00+01:00"))).toBe(false);
  });
});
