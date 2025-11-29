import { GoogleGenAI, Type } from "@google/genai";
import { PageElement } from "../types";

const apiKey = process.env.API_KEY || '';
// Note: In a real app, handle missing API key gracefully via UI.
// Here we assume it exists as per instructions.

const ai = new GoogleGenAI({ apiKey });

const LAYOUT_SYSTEM_INSTRUCTION = `
You are an expert web designer and frontend engineer. 
Your task is to generate a JSON structure representing a web page layout based on the user's description.

The structure is a tree of "PageElement" objects.
Interface PageElement {
  id: string; // Unique UUID
  type: 'section' | 'container' | 'text' | 'image' | 'button' | 'columns';
  name: string;
  props: {
    content?: string;
    src?: string;
    style?: {
      backgroundColor?: string; // Hex or Tailwind color name (e.g. transparent, #ffffff)
      color?: string;
      padding?: string; // e.g. "2rem", "40px"
      textAlign?: 'left' | 'center' | 'right';
      fontSize?: string; // e.g. "2rem", "1.5rem"
      borderRadius?: string;
      gap?: string;
      // ... standard CSS properties
    };
    className?: string; // Tailwind classes for layout (e.g. "grid grid-cols-3 gap-4")
  };
  children?: PageElement[];
}

Rules:
1. "section" is a full-width block.
2. "columns" should use 'className': 'grid grid-cols-N gap-4' in props.
3. "image" must have a 'src'. Use 'https://picsum.photos/800/600' or similar for placeholders unless specified.
4. "button" has 'content' (label) and 'style'.
5. Return ONLY the JSON array of root PageElements.
`;

export const generateLayout = async (prompt: string): Promise<PageElement[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a website layout for: ${prompt}. Return a JSON array of PageElements.`,
      config: {
        systemInstruction: LAYOUT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const jsonStr = response.text || "[]";
    return JSON.parse(jsonStr) as PageElement[];
  } catch (error) {
    console.error("Layout generation failed:", error);
    return [];
  }
};

export const generateText = async (prompt: string, currentContent?: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Current text: "${currentContent || ''}"
        User Request: ${prompt}
        
        Return only the improved/generated text string. No quotes, no markdown.
      `,
    });
    return response.text || currentContent || "";
  } catch (error) {
    console.error("Text generation failed:", error);
    return currentContent || "";
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });
    
    // We expect the model to return an image in the parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};
