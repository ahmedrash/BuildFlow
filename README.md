
# BuildFlow - Visual Page Builder

BuildFlow is a comprehensive, React-based visual website builder. It enables users to construct responsive, high-performance web pages using an intuitive drag-and-drop interface, featuring a robust component system and advanced template management.

## 🚀 Key Features

### 🎨 Visual Editor
*   **Drag & Drop Interface**: Seamlessly place elements into Sections, Containers, and Columns.
*   **Responsive Design**: Toggle between Desktop, Tablet, and Mobile views to ensure pixel-perfect responsiveness.
*   **Layer Management**: Dedicated "Layers" tree for navigating and selecting complex nested structures.
*   **Real-time Styling**: Instant visual feedback for padding, margins, colors, typography, borders, and shadows.
*   **Tailwind Integration**: Built-in autocomplete for Tailwind CSS classes allowing for unlimited styling possibilities.
*   **Visibility Control**: Toggle the visibility of hidden elements (like Popups and Mega Menus) directly in the editor canvas.
*   **History**: Full Undo/Redo capabilities.

### 🧩 Rich Component Library
BuildFlow comes with a diverse set of pre-built components:

*   **Layout**: 
    *   **Sections & Containers**: The building blocks of your page. Supports background images, videos, and parallax effects.
    *   **Columns**: Flexible grid systems.
*   **Media**: 
    *   **Images & Videos**: Support for external URLs and file uploads (Base64).
    *   **Sliders**: Advanced carousel with autoplay, custom intervals, multiple transitions (Fade, Zoom, Slide Up), and navigation styles.
    *   **Galleries**: Create stunning image displays with **Grid**, **Masonry**, or **Justified (Flex)** layouts.
    *   **Maps**: Google Maps integration with address resolution and zoom control.
*   **Forms**: 
    *   **Granular Builder**: Drag and drop individual form elements (Input, Textarea, Select, Radio, Checkbox, Button).
    *   **Smart Container**: Handles form submission endpoints, success messages, and reCAPTCHA integration.
*   **Navigation**: 
    *   **Navbar**: Sticky/Fixed/Relative positioning.
    *   **Menus**: Responsive menus with support for Dropdowns, Slide-out Drawers, and **Mega Menus** (embed full containers inside navigation items).
*   **Interaction**: 
    *   **Popups**: Turn any container into a popup triggered by buttons or links.
    *   **Testimonials**: Display reviews in **Grid** or **Slider** formats.
    *   **Cards**: Pre-built marketing cards with hover effects (Lift, Zoom, Glow).

### 📦 Advanced Template Engine
*   **Global Components**: Define "Master" components (like Headers/Footers). Changes to a master template automatically sync to all instances across the page.
*   **Local Templates**: Save snippets or sections to a local library for quick reuse.
*   **Detaching**: Convert global instances back into standalone elements for specific customization.

### 📤 Export
*   **One-Click Export**: Generate a standalone, production-ready `index.html` file.
*   **Zero Dependencies**: The exported file is self-contained with Tailwind CSS (CDN) and a lightweight React runtime to handle interactivity (Sliders, Mobile Menus, Popups) without a build step.

## 💻 Component API

### 1. BuildFlowEditor (The Builder)

The core editor component. Embed this to allow users to create and edit pages.

```tsx
import { BuildFlowEditor } from './components/BuildFlowEditor';

<BuildFlowEditor 
  initialData={elements}
  onSave={(data) => console.log(data)}
  googleMapsApiKey="YOUR_API_KEY"
  recaptchaSiteKey="YOUR_SITE_KEY"
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `initialData` | `PageElement[]` | *(Optional)* The initial state of the editor canvas. |
| `savedTemplates` | `SavedTemplate[]` | *(Optional)* An array of existing saved templates. |
| `onSave` | `(elements: PageElement[]) => void` | *(Optional)* Callback fired when the "Save" button is clicked. |
| `onSaveTemplate` | `(template: SavedTemplate) => void` | *(Optional)* Callback fired when a user creates a new template. |
| `onDeleteTemplate` | `(id: string) => void` | *(Optional)* Callback fired when a user deletes a template. |
| `onUploadImage` | `(file: File) => Promise<string>` | *(Optional)* Callback to handle image uploads. |
| `googleMapsApiKey` | `string` | *(Optional)* Your Google Maps API Key. |
| `recaptchaSiteKey` | `string` | *(Optional)* Your Google reCAPTCHA Site Key. |

### 2. BuildFlowRenderer (The Viewer)

Use this component to render the pages created with the editor in your own React app.

```tsx
import { BuildFlowRenderer } from './components/BuildFlowRenderer';

<BuildFlowRenderer 
  initialData={savedPageData}
  savedTemplates={templates}
/>
```

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
*   **Topbar**: Viewport controls (Desktop/Tablet/Mobile), Preview toggle, Settings, Hidden Element Toggle, and Export/Save actions.

### 2. Building Pages
1.  **Layout**: Start by dragging a **Section** or **Container** onto the canvas.
2.  **Grid**: Use **Columns** to create side-by-side layouts.
3.  **Content**: Drop text, images, or cards into the columns.
4.  **Style**: Click any element to edit its properties. Use the Color Picker for backgrounds/text, and inputs for spacing.

### 3. Mega Menus & Popups
*   **Mega Menus**: 
    1. Create a Container with your desired menu layout (columns, links, images).
    2. Note its ID.
    3. Select your Menu element, add a link, set type to "Mega Menu", and paste the Target ID.
*   **Popups**: 
    1. Create a Container for your popup.
    2. Note its ID.
    3. Select a Button, set Action to "Popup", and paste the Target ID.
    4. Use the **Eye Icon** in the top bar to toggle visibility of these hidden elements while editing.

### 4. Global Components
1.  Select an element (e.g., Navbar).
2.  Click **"Save as Template"**.
3.  Check **"Global Component"**.
4.  The element is now locked. Click **"Edit Master"** to make changes that reflect everywhere.

## ⌨️ Shortcuts
*   **Ctrl/Cmd + Z**: Undo
*   **Ctrl/Cmd + Y** (or Shift+Z): Redo
