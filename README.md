# BuildFlow - Visual Page Builder

BuildFlow is a comprehensive, React-based visual website builder. It enables users to construct responsive, high-performance web pages using an intuitive drag-and-drop interface, featuring a robust component system and advanced template management.

## 🚀 Key Features

### 🎨 Visual Editor
*   **Drag & Drop Interface**: Seamlessly place elements into Sections, Containers, and Columns.
*   **Responsive Design**: Toggle between Desktop, Tablet, and Mobile views to ensure pixel-perfect responsiveness.
*   **Layer Management**: Dedicated "Layers" tree for navigating and selecting complex nested structures.
*   **Real-time Styling**: Instant visual feedback for padding, margins, colors, typography, borders, and shadows.
*   **Tailwind Integration**: Built-in autocomplete for Tailwind CSS classes allowing for unlimited styling possibilities.

### 🧩 Rich Component Library
BuildFlow comes with a diverse set of pre-built components:
*   **Layout**: Sections, Containers, Grid Columns.
*   **Media**: Images, Videos (YouTube/Embed), Image Sliders (with autoplay & custom nav), Galleries (Grid, Masonry, Flex).
*   **Interaction**: Buttons, Links, Testimonial Carousels.
*   **Marketing**: Pricing Cards, Feature Cards with advanced hover effects (Lift, Zoom, Glow, Border).
*   **Forms**: Visual form builder with support for various input types (Text, Email, Textarea, Checkbox) and validation settings.
*   **Navigation**: Sticky Navbars with logo and link management.
*   **Utilities**: Google Maps integration, Custom Code blocks for raw HTML/CSS.

### 📦 Advanced Template Engine
*   **Global Components**: Define "Master" components (like Headers/Footers). Changes to a master template automatically sync to all instances across the page.
*   **Local Templates**: Save snippets or sections to a local library for quick reuse without syncing.
*   **Detaching**: Convert global instances back into standalone elements for specific customization.

### 📤 Export
*   **One-Click Export**: Generate a standalone, production-ready `index.html` file containing all styles, scripts, and content.

## 🛠 Tech Stack

*   **Frontend**: React, TypeScript
*   **Styling**: Tailwind CSS
*   **Icons**: Custom SVG System
*   **Architecture**: Component-based recursive rendering

## 📖 Usage Guide

### 1. The Workspace
*   **Sidebar (Left)**: Access the **Elements** palette to drag items onto the canvas and the **Layers** tree to view the document structure.
*   **Canvas (Center)**: The main WYSIWYG editing area.
*   **Properties Panel (Right)**: Context-sensitive settings for the selected element (Content, Style, Design).
*   **Topbar**: Viewport controls (Desktop/Tablet/Mobile), Preview toggle, Settings, and Export/Save actions.

### 2. Building Pages
1.  **Layout**: Start by dragging a **Section** or **Container** onto the canvas.
2.  **Grid**: Use **Columns** to create side-by-side layouts.
3.  **Content**: Drop text, images, or cards into the columns.
4.  **Style**: Click any element to edit its properties. Use the Color Picker for backgrounds/text, and sliders/inputs for spacing.

### 3. Global Components (e.g., Navbar)
1.  Select the Navbar element.
2.  Click **"Save as Template"** in the properties panel.
3.  Check **"Global Component"**.
4.  The element is now locked. To edit it, select it and click **"Edit Master"**. Changes will reflect everywhere.

### 4. Publishing
*   Click **Export** in the top bar to download your page as a raw HTML file, ready to be hosted anywhere.

## ⌨️ Development

### Project Structure
```
/src
  /components
    /elements       # Individual component renderers (Slider, Form, etc.)
    /properties     # The right-hand settings panel logic
    /ui             # Shared UI components
    EditorCanvas.tsx # Core recursive renderer for the editor
    Sidebar.tsx     # Drag-and-drop source
  /utils
    htmlExporter.ts # HTML generation logic
  /data
    constants.ts    # Default templates and fonts
  App.tsx           # Main entry point
  types.ts          # Type definitions for the element tree
```