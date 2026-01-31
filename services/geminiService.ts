import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string.
 */
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes the crop image using Gemini.
 */
export const analyzeCropDisease = async (
  base64Image: string
): Promise<DiagnosisResult> => {
  
  const systemInstruction = `
    You are an expert Botanist and Agricultural Plant Pathologist.
    
    TASK 1: PLANT IDENTIFICATION
    First, you must visually identify the plant species in the image with high accuracy.
    You know all Indian crops, trees, vegetables, fruits, spices, medicinal plants, and flowers.
    
    TASK 2: DISEASE DIAGNOSIS
    Only if a plant is identified, proceed to check for diseases, pests, or nutrient deficiencies.
    
    If the image is NOT a plant, or if the plant cannot be identified, or if it is just a random object:
    - Set 'detectedCrop' to 'Unknown'.
    - Set 'isHealthy' to false.
    - Provide a description stating that no crop could be identified.
    
    Output strictly valid JSON.
  `;

  const prompt = `
    Analyze this image.
    
    1. IDENTIFY THE PLANT:
    Check against this comprehensive list of Indian flora:
    - Field Crops: Paddy (Rice), Wheat, Maize, Sorghum (Cholam), Pearl Millet (Kambu), Finger Millet (Ragi), Groundnut, Cotton, Sugarcane, Red Gram, Black Gram, Green Gram, Chickpea (Bengal Gram), Horse Gram.
    - Vegetables: Tomato, Brinjal, Chili, Okra, Onion, Potato, Drumstick, Bitter Gourd, Snake Gourd, Bottle Gourd, Pumpkin, Radish, Spinach (Keerai varieties), Carrot, Beetroot, Beans, Cluster Beans, Elephant Foot Yam.
    - Fruits: Banana, Mango, Coconut, Papaya, Guava, Pomegranate, Jackfruit, Citrus (Lemon/Lime/Orange), Watermelon, Sapota, Amla, Custard Apple, Wood Apple.
    - Plantation/Trees: Areca nut, Teak, Neem, Tamarind, Rubber, Coffee, Tea, Cashew, Bamboo, Sandalwood, Eucalyptus, Cocoa.
    - Spices/Herbs: Turmeric, Black Pepper, Cardamom, Betel Vine, Ginger, Garlic, Curry Leaves, Mint, Coriander.
    - Flowers: Jasmine, Marigold, Rose, Crossandra, Hibiscus.

    2. DETECT HEALTH STATUS:
    - Is it healthy or diseased?
    - If diseased, name the specific disease (e.g., Blast, Rust, Mosaic, Rot, Wilt) or pest (e.g., Borer, Mite, Aphid).
    - Determine Severity (Low, Medium, High).
    - Identify Cause (Fungal, Bacterial, Viral, Pest, Nutrient Deficiency).

    3. PROVIDE TREATMENT (if issues detected):
    - Suggest 2-3 specific remedies (Organic & Chemical).
    - Translate crop name, disease name, description, and treatments to Tamil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedCrop: { type: Type.STRING },
            detectedCropTamil: { type: Type.STRING },
            diseaseName: { type: Type.STRING },
            diseaseNameTamil: { type: Type.STRING },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
            severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            description: { type: Type.STRING },
            descriptionTamil: { type: Type.STRING },
            treatment: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            treatmentTamil: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            cause: { type: Type.STRING },
            isHealthy: { type: Type.BOOLEAN },
          },
          required: [
            "detectedCrop", "detectedCropTamil",
            "diseaseName", "diseaseNameTamil", 
            "severity", "description", "descriptionTamil", 
            "treatment", "treatmentTamil", "cause", "isHealthy"
          ],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as DiagnosisResult;
    } else {
      throw new Error("No response text from Gemini");
    }
  } catch (error) {
    console.error("Error analyzing crop:", error);
    throw error;
  }
};