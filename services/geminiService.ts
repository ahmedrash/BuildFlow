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
  id: string; // Unique UUID (e.g., "el-" + random)
  type: 'section' | 'container' | 'columns' | 'text' | 'heading' | 'image' | 'button' | 'video' | 'card' | 'form' | 'gallery' | 'testimonial' | 'slider' | 'navbar';
  name: string; // Descriptive name
  props: {
    // Common
    className?: string; // Tailwind CSS classes (e.g., "bg-white p-8", "grid grid-cols-3 gap-4")
    style?: {
      backgroundColor?: string;
      color?: string;
      padding?: string;
      height?: string;
      // ... standard CSS
    };
    content?: string; // For text, heading, button

    // Images
    src?: string; // Use 'https://picsum.photos/800/600?random=1' for placeholders

    // Cards (Self-contained, do not add children)
    cardTitle?: string;
    cardText?: string;
    cardButtonText?: string;
    cardImageType?: 'image' | 'icon'; // Default 'image'
    cardIcon?: string; // e.g., 'Box', 'Layout', 'Settings' from Lucide
    cardLayout?: 'vertical' | 'horizontal';
    cardHoverEffect?: 'lift' | 'zoom' | 'glow';
    
    // Forms (Self-contained)
    formFields?: Array<{ id: string; type: 'text'|'email'|'textarea'|'checkbox'; label: string; placeholder?: string }>;
    formSubmitButtonText?: string;

    // Gallery
    galleryImages?: Array<{ id: string; src: string; alt?: string }>;
    galleryLayout?: 'grid' | 'masonry' | 'flex';
    galleryColumnCount?: number;

    // Testimonials
    testimonialItems?: Array<{ id: string; content: string; author: string; role: string; rating: number; avatarSrc?: string }>;
    testimonialLayout?: 'grid' | 'slider';

    // Navbar
    logoText?: string;
    navLinks?: Array<{ label: string; href: string }>;
    
    // Slider
    sliderAutoplay?: boolean;
  };
  children?: PageElement[];
}

Rules:
1. **Structure**: Use 'section' for top-level blocks. Use 'container' for wrapping content. Use 'columns' with 'grid grid-cols-N' class for layouts.
2. **Cards**: Use the 'card' type for feature blocks, blog posts, or services. Configure them via props (cardTitle, cardText), NOT children.
3. **Forms**: Use the 'form' type. Define fields in 'formFields'.
4. **Galleries**: Use 'gallery' type with 'galleryImages'.
5. **Sliders**: The 'slider' element MUST have children. Each child must be a 'container' representing a slide.
6. **Images**: Always provide a placeholder 'src' for images.
7. **Tailwind**: Use Tailwind CSS classes in 'className' for spacing (p-4, m-2), layout (flex, grid), and typography (text-xl, font-bold).
8. **IDs**: Generate unique string IDs for every element.

Return ONLY the JSON array of root PageElements.
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
