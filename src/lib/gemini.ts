import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface InvoiceData {
  summary: string;
  full_text: string;
  structured_data: {
    merchant: {
      name: string;
      address: string;
      phone?: string;
      email?: string;
      website?: string;
    };
    invoice_details: {
      number: string;
      date: string;
      due_date?: string;
      currency: string;
    };
    line_items: Array<{
      description: string;
      quantity: number;
      unit_price: number;
      amount: number;
    }>;
    totals: {
      subtotal: number;
      tax_amount: number;
      discount?: number;
      total_amount: number;
    };
    payment_info?: {
      bank_name?: string;
      account_number?: string;
      iban?: string;
      swift_code?: string;
    };
  };
}

export async function processInvoice(fileData: string, mimeType: string): Promise<InvoiceData> {
  const model = "gemini-3-flash-preview";

  const prompt = `Analyze this invoice and provide:
1. A concise human-readable summary.
2. The full text extracted from the document.
3. Structured data following the schema.

Be precise with amounts and dates. If a field is missing, leave it null or omit it.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: fileData.split(',')[1], // Remove the data:image/png;base64, part
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          full_text: { type: Type.STRING },
          structured_data: {
            type: Type.OBJECT,
            properties: {
              merchant: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  address: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  email: { type: Type.STRING },
                  website: { type: Type.STRING },
                },
              },
              invoice_details: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.STRING },
                  date: { type: Type.STRING },
                  due_date: { type: Type.STRING },
                  currency: { type: Type.STRING },
                },
              },
              line_items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    unit_price: { type: Type.NUMBER },
                    amount: { type: Type.NUMBER },
                  },
                },
              },
              totals: {
                type: Type.OBJECT,
                properties: {
                  subtotal: { type: Type.NUMBER },
                  tax_amount: { type: Type.NUMBER },
                  discount: { type: Type.NUMBER },
                  total_amount: { type: Type.NUMBER },
                },
              },
              payment_info: {
                type: Type.OBJECT,
                properties: {
                  bank_name: { type: Type.STRING },
                  account_number: { type: Type.STRING },
                  iban: { type: Type.STRING },
                  swift_code: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as InvoiceData;
}
