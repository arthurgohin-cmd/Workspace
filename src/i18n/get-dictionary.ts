import "server-only";
import type { Locale } from "./config";
import fr from "./dictionaries/fr.json";
import en from "./dictionaries/en.json";

const dictionaries = { fr, en };

export type Dictionary = typeof fr;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
