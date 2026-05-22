import { formatPrice } from "./utils";

export type ProductDescriptionResult = {
  title: string;
  shortDescription: string;
  description: string;
  rawOutput: string;
};

function extractTextFromResponse(data: any): string {
  if (!data) return "";

  const output = data.output ?? data.outputs ?? [];
  const items = Array.isArray(output) ? output : [output];

  for (const item of items) {
    if (item?.type === "output_text" && Array.isArray(item.content)) {
      return item.content.map((part: any) => part.text ?? "").join("");
    }
    if (item?.type === "message" && Array.isArray(item.content)) {
      return item.content.map((part: any) => part.text ?? "").join("");
    }
  }

  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  return JSON.stringify(data);
}

function parseJsonFromText(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Impossibile leggere JSON dalla risposta AI.");
  }

  const jsonString = text.slice(start, end + 1);
  return JSON.parse(jsonString);
}

export async function generateProductDescriptionFromImage(
  imageUrl: string,
  price: number
): Promise<ProductDescriptionResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Fallback: se la chiave OpenAI non è presente, restituire una descrizione generica basata su prezzo e URL immagine
    const title = "Prodotto artigianale";
    const shortDescription = `Prodotto artigianale, prezzo ${formatPrice(price)}.`;
    const description = `Descrizione generica del prodotto. Prezzo: ${formatPrice(price)}. Immagine: ${imageUrl}. Specifiche e dettagli verranno aggiunti quando sarà disponibile il servizio AI.`;
    return {
      title,
      shortDescription,
      description,
      rawOutput: JSON.stringify({ title, shortDescription, description }),
    };
  }

  const prompt = `Hai una foto di un prodotto da vendere online. Usa il prezzo ${formatPrice(
    price
  )} e descrivi il prodotto in italiano come se dovessi inserirlo in un catalogo ecommerce. Restituisci SOLO un oggetto JSON valido con questi campi: title, shortDescription, description. Non aggiungere altro testo.`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            { type: "input_image", image_url: imageUrl },
          ],
        },
      ],
      max_output_tokens: 400,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Errore OpenAI: ${response.status} ${body}`);
  }

  const data = await response.json();
  const rawOutput = extractTextFromResponse(data).trim();
  const parsed = parseJsonFromText(rawOutput);

  return {
    title: parsed.title || "",
    shortDescription: parsed.shortDescription || "",
    description: parsed.description || "",
    rawOutput,
  };
}
