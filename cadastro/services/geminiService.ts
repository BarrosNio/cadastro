
import { GoogleGenAI, Type } from "@google/genai";
import { Client } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSalesAdvice = async (client: Client) => {
  try {
    const prompt = `
      Atue como um especialista em vendas de descontos na conta de luz.
      Analise este lead e gere um script de abordagem curto e persuasivo para o WhatsApp.
      
      Dados do Cliente:
      Nome: ${client.name}
      Valor da Conta: R$ ${client.billValue}
      Baixa Renda: ${client.isLowIncomeProgram ? 'Sim' : 'Não'}
      Observações: ${client.notes}
      
      Gere um JSON com:
      1. pitch: O texto para enviar no WhatsApp.
      2. strategy: Uma breve estratégia de fechamento.
      3. potential_savings: Uma estimativa de quanto ele poderia economizar (estimativa fictícia baseada em 20% de desconto).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pitch: { type: Type.STRING },
            strategy: { type: Type.STRING },
            potential_savings: { type: Type.STRING }
          },
          required: ["pitch", "strategy", "potential_savings"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erro ao obter conselhos do Gemini:", error);
    return null;
  }
};
