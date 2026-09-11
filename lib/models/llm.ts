import { FEATURE_LABELS } from "../astronomy/constants";

export interface LLMClassificationResult {
  probability: number;
  reasoning: string;
}

/**
 * Classifies an exoplanet candidate using Groq LLM reasoning or fallback heuristic reasoning.
 */
export async function classifyWithLLM(
  feats: number[],
  hasSpectroscopy: boolean,
  apiKey?: string,
  modelName: string = "llama-3.1-8b-instant"
): Promise<LLMClassificationResult> {
  const key = (apiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY || "").trim();

  // If a valid Groq API key is present, execute live LLM inference
  if (key && key.startsWith("gsk_")) {
    try {
      const lines = feats
        .map(
          (v, i) =>
            `- ${FEATURE_LABELS[i] || `feature ${i}`}: ${v.toFixed(4)}`
        )
        .join("\n");

      const prompt = `You are an exoplanet transit classifier. Below are ${
        feats.length
      } numeric features extracted from a star's light curve${
        hasSpectroscopy ? " and its transmission spectrum" : ""
      }:\n\n${lines}\n\nBased on these features, judge how likely this is a genuine planetary transit, as opposed to noise, a stellar flare, an eclipsing binary, or an instrumental artifact.\n\nRespond with ONLY a JSON object, no other text, in exactly this form:\n{"probability": <number between 0 and 1>, "reasoning": "<one or two sentence explanation citing specific feature values>"}`;

      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: modelName,
          max_tokens: 300,
          temperature: 0,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        const text = (data.choices || [])
          .map((c: { message?: { content?: string } }) => c.message?.content || "")
          .join("\n")
          .trim();
        const cleaned = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return {
          probability: Math.max(0, Math.min(1, Number(parsed.probability))),
          reasoning: parsed.reasoning || "",
        };
      }
    } catch (err) {
      console.warn("Groq LLM call error, falling back to analytical reasoning:", err);
    }
  }

  // Fallback analytical reasoning if no key is supplied
  const depth = feats[0];
  const sym = feats[2];
  const flat = feats[3];
  const snr = feats[4] * 40;
  const secondary = feats[6];

  let prob = 0.5;
  if (depth > 0.001 && flat > 0.4 && sym > 0.6 && snr > 5) {
    prob = 0.88 + Math.min(0.1, snr / 100);
    if (secondary < 0.3) prob += 0.01;
  } else if (depth <= 0.0005 || snr < 3) {
    prob = 0.15;
  }

  prob = Math.max(0.01, Math.min(0.999, prob));

  const reasoning =
    flat > 0.5
      ? `Transit depth (${(depth * 100).toFixed(3)}%) and U-shape flatness (${(flat * 100).toFixed(0)}%) exhibit strong bilateral symmetry (${(sym * 100).toFixed(0)}%) with SNR=${snr.toFixed(1)}, consistent with an occulting exoplanet.`
      : `Profile exhibits V-shaped ingress or shallow SNR (${snr.toFixed(1)}), suggesting potential grazing binary or elevated stellar variability.`;

  return { probability: prob, reasoning };
}
