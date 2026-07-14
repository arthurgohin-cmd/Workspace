import "server-only";

/**
 * Traduit un texte FR -> EN via l'API DeepL si DEEPL_API_KEY est configurée.
 * Sans clé, retombe sur le texte source (à corriger manuellement dans l'admin).
 */
export async function translateToEnglish(text: string): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (!apiKey) return trimmed;

  try {
    const host = apiKey.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";
    const res = await fetch(`https://${host}/v2/translate`, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text: trimmed,
        source_lang: "FR",
        target_lang: "EN",
      }),
    });

    if (!res.ok) return trimmed;
    const data = (await res.json()) as { translations?: { text: string }[] };
    return data.translations?.[0]?.text ?? trimmed;
  } catch {
    return trimmed;
  }
}
