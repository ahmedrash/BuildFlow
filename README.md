# BuildFlow - Visual Page Builder

BuildFlow is a powerful, React-based visual website builder integrated with Google's Gemini AI. It allows users to construct responsive web pages using a drag-and-drop interface, generate layouts and content via AI, and manage complex component hierarchies.

## 🚀 Key Features

### 🎨 Visual Editor
*   **Drag & Drop Interface**: Intuitive canvas to place elements inside containers, columns, or sections.
*   **Responsive Preview**: Switch between Desktop, Tablet, and Mobile viewports to test responsiveness.
*   **Layer Management**: A dedicated "Layers" tab in the sidebar to navigate and select deeply nested elements.
*   **Live Styling**: Real-time updates for padding, margins, colors, typography, and background media.

### 🤖 AI Integration (Google Gemini)
*   **Layout Generation**: Describe a section (e.g., "A pricing table with 3 cards") and the AI builds the component structure automatically.
*   **Text Assistant**: Rewrite, expand, or polish text content for headings and paragraphs.
*   **Image Generation**: Generate unique images directly onto the canvas using Gemini Imagen models.
*   **Background Generation**: Create abstract textures or specific scenes for section backgrounds.

### 🧩 Component System
The builder supports a wide range of HTML and Logic components:
*   **Structure**: Sections, Containers, Grid Columns (Tailwind-based).
*   **Basics**: Text, Headings, Buttons, Images, Videos (YouTube/Vimeo/Upload).
*   **Advanced**:
    *   **Sliders**: Interactive carousels with customizable navigation and nested slide content.
    *   **Forms**: A full form builder with validation, field management (Text, Email, Checkbox, etc.), and spam protection options.
    *   **Navbars**: Responsive navigation bars with logo and link management.
    *   **Maps**: Google Maps embed integration.
    *   **Custom Code**: Inject raw HTML/CSS/JS for specific needs.

### 📦 Template Engine
*   **Local Templates**: Save any element as a template to reuse later.
*   **Global Components**: Save an element as "Global". Changes made to the **Master Template** automatically reflect across all instances on the canvas.
*   **Detaching**: Convert a Global Instance back into a standalone local copy for independent editing.

## 🛠 Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI**: Google GenAI SDK (`@google/genai`)
*   **Icons**: Custom SVG set (Lucide-style)
*   **State Management**: React Hooks (Context-free local state lifting)

## 📖 Usage Guide

### 1. The Workspace
*   **Left Sidebar**: Contains the **Elements** palette (drag to canvas) and the **Layers** tree (view hierarchy).
*   **Center Canvas**: The main editing area. Click elements to select them.
*   **Right Panel**: The **Properties Panel**. Context-aware settings for the selected element.
*   **Top Bar**: Viewport controls, AI Generator, Settings, Preview Mode, and Save actions.

### 2. Editing Elements
1.  **Select**: Click an element on the canvas or in the Layers tab.
2.  **Edit Content**: Update text, images, or links in the right sidebar.
3.  **Style**: Adjust colors, spacing, and typography.
4.  **Advanced CSS**: Use the "Custom CSS Classes" field with Tailwind autocomplete to apply specific styles.

### 3. Using the AI
*   **Generate Layout**: Click the "Generate" button in the top bar. Enter a prompt like "A hero section with a dark background and two call to action buttons."
*   **Edit Content**: Select a text or image element. Look for the "AI Assistant" or "Generate New Image" buttons in the properties panel.

### 4. Global Components
1.  Select a complex element (like a Navbar or Footer).
2.  Click **"Save as Template"** in the properties panel.
3.  Check the **"Global Component"** box and confirm.
4.  The element on the canvas immediately becomes a locked instance.
5.  To edit it, select it and click **"Edit Master"**. Changes saved here update all references.

### 5. Forms
1.  Drag a **Form** element to the canvas.
2.  In the properties panel, use the "Form Fields" section to Add, Edit, or Reorder inputs.
3.  Configure submission URLs and success messages.

## ⌨️ Development

### Environment Variables
The application requires a Google Gemini API Key.
`process.env.API_KEY` must be configured in the build environment.

### Project Structure
```
/src
  /components
    /elements       # Individual component renderers
    /properties     # The right-hand settings panel
    /ui             # Shared UI (Modals, Toasts, ColorPicker)
    EditorCanvas.tsx # Recursive component for the visual tree
    Sidebar.tsx     # Left panel logic
  /services
    geminiService.ts # AI integration logic
  /data
    constants.ts    # Fonts, Templates
    tailwindClasses.ts # Autocomplete data
  App.tsx           # Main application controller
  types.ts          # TypeScript interfaces
```