
import { GoogleGenAI, Type } from "@google/genai";
import { VehicleType } from "../types";

export interface ParsedOrderRequest {
  origin: string;
  destination: string;
  vehicleType: VehicleType;
  estimatedPrice: number;
  summary: string;
  cargoWeight: string;
  cargoType: string;
}

export interface AddressResult {
  address: string | null;
  mapUri?: string;
}

const PRICING_RULES = `
  한국 화물 운송 요금 기준 (추정):
  1. 오토바이: 기본 8,000원 (5km), 추가 1,000원/km.
  2. 다마스: 기본 25,000원 (10km).
  3. 라보: 기본 35,000원 (10km).
  4. 1톤 트럭: 기본 50,000원 (10km).
  5. 1톤 윙바디: 1톤 트럭 요금의 1.3배.
  6. 2.5톤 트럭: 1톤 트럭 요금의 1.8배.
  * 야간/우천 시 20% 할증.
`;

export const parseNaturalLanguageOrder = async (input: string): Promise<ParsedOrderRequest | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return null;
  }

  // Create instance right before call as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      사용자 요청: "${input}"
      
      작업:
      1. 출발지/도착지 추출.
      2. 짐의 양/무게를 보고 차량(MOTORCYCLE, DAMAS, LABO, TRUCK_1TON, TRUCK_1TON_WING, TRUCK_2_5TON) 선택.
         - 비오거나 눈오면 윙바디/탑차 추천.
         - 1.1톤 이상이면 TRUCK_2_5TON.
      3. 거리 계산 및 요금 산정.
      
      JSON 반환.
    `;

    const response = await ai.models.generateContent({
      // Complex reasoning task requires gemini-3-pro-preview
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            origin: { type: Type.STRING },
            destination: { type: Type.STRING },
            vehicleType: { 
              type: Type.STRING, 
              enum: ["MOTORCYCLE", "DAMAS", "LABO", "TRUCK_1TON", "TRUCK_1TON_WING", "TRUCK_2_5TON"]
            },
            estimatedPrice: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            cargoWeight: { type: Type.STRING, description: "예: 50kg" },
            cargoType: { type: Type.STRING, description: "예: 박스, 가구" }
          },
          required: ["origin", "destination", "vehicleType", "estimatedPrice", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as ParsedOrderRequest;
  } catch (error) {
    console.error("Gemini parsing error:", error);
    return null;
  }
};

export const getAddressFromCoordinates = async (lat: number, lng: number): Promise<AddressResult | null> => {
  if (!process.env.API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Maps grounding is supported in Gemini 2.5 series models
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `What is the precise road name address in Korean for the coordinates ${lat}, ${lng}? Just return the address text, nothing else.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    // Extract mandatory grounding URL
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const mapUri = chunks?.find(c => c.maps)?.maps?.uri;

    return {
      address: response.text?.trim() || null,
      mapUri
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
};

export const calculateFare = async (origin: string, destination: string, vehicleType: VehicleType): Promise<number | null> => {
  if (!process.env.API_KEY || !origin || !destination) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      출발: ${origin}, 도착: ${destination}, 차종: ${vehicleType}
      거리 계산 후 요금 산정.
      ${PRICING_RULES}
      JSON { "price": 숫자 } 반환.
    `;

    const response = await ai.models.generateContent({
      // Upgraded to gemini-3-pro-preview for advanced reasoning and math
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            price: { type: Type.INTEGER }
          },
          required: ["price"]
        }
      }
    });

    const text = response.text;
    const result = JSON.parse(text || "{}");
    return result.price || null;
  } catch (error) {
    console.error("Fare calculation error:", error);
    return null;
  }
};
