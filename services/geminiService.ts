
import { GoogleGenAI, Type } from "@google/genai";
import { VehicleType } from "../types";

export interface ParsedOrderRequest {
  origin: string;
  destination: string;
  recipientPhone?: string;
  vehicleType: VehicleType;
  estimatedPrice: number;
  summary: string;
  cargoWeight: string;
  cargoType: string;
  urgency: 'NORMAL' | 'URGENT';
}

const PRICING_RULES = `
  한국 화물 운송 요금 기준:
  1. 오토바이: 기본 8,000원.
  2. 다마스: 기본 25,000원.
  3. 라보: 기본 35,000원.
  4. 1톤 트럭: 기본 50,000원.
  * 수수료: 현재 프로모션으로 0% 적용.
`;

export const parseNaturalLanguageOrder = async (input: string): Promise<ParsedOrderRequest | null> => {
  // Use process.env.API_KEY directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      사용자 요청: "${input}"
      작업:
      1. 출발지/도착지 및 도착지 연락처(있는 경우) 추출.
      2. 짐 정보를 토대로 차량 선택.
      3. 가격 산정 (수수료 0원 기준).
      배차 가격 산정 규칙:
      ${PRICING_RULES}
      JSON으로 반환하세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            origin: { type: Type.STRING },
            destination: { type: Type.STRING },
            recipientPhone: { type: Type.STRING },
            vehicleType: { type: Type.STRING, enum: ["MOTORCYCLE", "DAMAS", "LABO", "TRUCK_1TON", "TRUCK_1TON_WING", "TRUCK_2_5TON"] },
            estimatedPrice: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            cargoWeight: { type: Type.STRING },
            cargoType: { type: Type.STRING },
            urgency: { type: Type.STRING, enum: ["NORMAL", "URGENT"] }
          },
          required: ["origin", "destination", "vehicleType", "estimatedPrice", "summary"]
        }
      }
    });

    // response.text is a property, not a method.
    const jsonStr = response.text;
    return jsonStr ? (JSON.parse(jsonStr) as ParsedOrderRequest) : null;
  } catch (error) {
    console.error("AI Parsing Error:", error);
    return null;
  }
};

export const getAddressFromCoordinates = async (lat: number, lng: number) => {
  // Use process.env.API_KEY directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      // Maps grounding is only supported in Gemini 2.5 series models.
      model: "gemini-2.5-flash",
      contents: "What is the road address for this location in Korean?",
      config: { 
        tools: [{ googleMaps: {} }],
        // Correctly include user location in toolConfig for maps grounding.
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });
    // response.text is a property.
    return { address: response.text?.trim() };
  } catch { return null; }
};

export const calculateFare = async (origin: string, destination: string, vehicleType: VehicleType) => {
  // Use process.env.API_KEY directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Calculate fare between ${origin} and ${destination} for ${vehicleType}.`,
      config: { 
        responseMimeType: "application/json",
        // Recommended approach: use responseSchema for structured output.
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            price: { 
              type: Type.NUMBER,
              description: 'The shipping price in KRW'
            }
          },
          required: ["price"]
        }
      }
    });
    // response.text is a property.
    const jsonStr = response.text;
    if (!jsonStr) return null;
    const result = JSON.parse(jsonStr);
    return result.price;
  } catch { return null; }
};
