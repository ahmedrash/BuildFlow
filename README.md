
# BuildFlow - Visual Page Builder

BuildFlow is a comprehensive, React-based visual website builder. It enables users to construct responsive, high-performance web pages using an intuitive drag-and-drop interface.

**[Live Demo](https://buildfloweditor.netlify.app)**

## 📦 Installation

Install BuildFlow via npm or yarn:

```bash
npm install buildflow-react
# or
yarn add buildflow-react
```

**Note:** BuildFlow requires `react`, `react-dom`, and `tailwindcss` to be installed in your project.

## 🚀 Usage

### 1. Configure Tailwind
BuildFlow components rely on Tailwind CSS. Ensure your `tailwind.config.js` scans the BuildFlow package:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/buildflow-react/dist/**/*.{js,mjs}" // Add this line
  ],
  // ...
}
```

### 2. Using the Editor

Import the CSS and the `BuildFlowEditor` component.

```tsx
import React, { useState } from 'react';
import { BuildFlowEditor, type PageElement, type SavedTemplate, TEMPLATES } from 'buildflow-react';

// Import BuildFlow styles (Required for animations & layout)
import 'buildflow-react/dist/style.css'; 

const MyBuilderApp = () => {
  // Demo Implementation: Load initial data from localStorage or fallback to default template
  const [initialData] = useState<PageElement[]>(() => {
    const saved = localStorage.getItem('buildflow_demo_page');
    return saved ? JSON.parse(saved) : TEMPLATES[0].elements;
  });

  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>(() => {
    const saved = localStorage.getItem('buildflow_templates');
    return saved ? JSON.parse(saved) : [];
  });

  // Handle saving the page layout
  const handleSave = (elements: PageElement[]) => {
    localStorage.setItem('buildflow_demo_page', JSON.stringify(elements));
    console.log('Saved to local storage:', elements);
  };

  // Handle saving templates
  const handleSaveTemplate = (template: SavedTemplate) => {
    const newTemplates = [...savedTemplates, template];
    setSavedTemplates(newTemplates);
    localStorage.setItem('buildflow_templates', JSON.stringify(newTemplates));
  };

  // Handle deleting templates
  const handleDeleteTemplate = (id: string) => {
    const newTemplates = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(newTemplates);
    localStorage.setItem('buildflow_templates', JSON.stringify(newTemplates));
  };

  // Handle image upload (Simple Base64 implementation for demo)
  const handleUploadImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  };

  // --- API Configuration ---
  // In a real app, these would come from environment variables or a configuration endpoint.
  const GOOGLE_MAPS_API_KEY = ""; 
  const RECAPTCHA_SITE_KEY = "";

  return (
    <div style={{ height: '100vh' }}>
      <BuildFlowEditor 
        initialData={initialData}
        savedTemplates={savedTemplates}
        onSave={handleSave}
        onSaveTemplate={handleSaveTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        onUploadImage={handleUploadImage}
        googleMapsApiKey="YOUR_GOOGLE_MAPS_KEY" // Optional
        recaptchaSiteKey="YOUR_RECAPTCHA_KEY"   // Optional
      />
    </div>
  );
};
```

### 3. Using the Renderer

The `BuildFlowRenderer` displays the saved content to your end users. It supports all the interactive elements (sliders, popups, forms) created in the editor.

```tsx
import { BuildFlowRenderer } from 'buildflow-react';
import 'buildflow-react/dist/style.css'; 

const MyPage = ({ pageData, templates }) => {
  return (
    <BuildFlowRenderer 
      initialData={pageData} 
      savedTemplates={templates}
      googleMapsApiKey="YOUR_GOOGLE_MAPS_KEY" // Optional: Needed for Map element
      recaptchaSiteKey="YOUR_RECAPTCHA_KEY"   // Optional: Needed for Form Recaptcha
    />
  );
};
```

## 🎨 Visual Editor Features
*   **Drag & Drop Interface**: Seamlessly place elements into Sections, Containers, and Columns.
*   **Responsive Design**: Toggle between Desktop, Tablet, and Mobile views.
*   **Real-time Styling**: Instant visual feedback for padding, margins, colors, typography.
*   **Visibility Control**: Toggle hidden elements (Popups, Mega Menus) in the canvas.
*   **Export**: Generate a standalone `index.html` file directly from the editor.

## 🧩 Component Library
*   **Layout**: Sections, Containers, Columns.
*   **Media**: Images, Videos, Sliders, Galleries, Maps.
*   **Forms**: Granular builder (Input, Select, Checkbox) + Smart Containers.
*   **Navigation**: Navbars, Mega Menus, Mobile Drawers.
*   **Interaction**: Popups, Cards, Testimonials.

## 🔌 Extending (Developer Guide)

BuildFlow supports a **Registry Pattern** for adding custom components. This allows you to introduce unique elements with custom rendering logic and property controls.

### Example: Registering a Custom "Alert" Component

This example demonstrates how to:
1.  Define the **Renderer** (what shows up on the canvas).
2.  Define the **Properties Panel** (the form controls in the sidebar).
3.  **Register** the component so it appears in the editor.

```tsx
import { ComponentRegistry, PageElement } from 'buildflow-react';
import { Star } from 'lucide-react'; // Example icon library

// 1. Define the Renderer
const AlertBox = ({ element }: { element: PageElement }) => {
  const { title, content, variant } = element.props;
  
  // Dynamic styling based on props
  const colors = variant === 'error' 
    ? 'bg-red-50 border-red-500 text-red-700' 
    : 'bg-blue-50 border-blue-500 text-blue-700';

  return (
    <div className={`p-4 border-l-4 rounded ${colors} ${element.props.className}`} style={element.props.style}>
      <h3 className="font-bold mb-1">{title || 'Alert'}</h3>
      <p>{content || 'Notification text...'}</p>
    </div>
  );
};

// 2. Define the Properties Panel (Optional)
// This React component will be rendered in the sidebar when the element is selected.
const AlertProps = ({ element, onUpdateProps }: { element: PageElement; onUpdateProps: (id: string, props: any) => void }) => (
  <div className="space-y-3">
    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
        <input 
          className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-1 focus:ring-indigo-500 outline-none" 
          value={element.props.title || ''} 
          onChange={(e) => onUpdateProps(element.id, { title: e.target.value })} 
          placeholder="Enter title..."
        />
    </div>
    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Variant</label>
        <select 
          className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
          value={element.props.variant || 'info'}
          onChange={(e) => onUpdateProps(element.id, { variant: e.target.value })}
        >
          <option value="info">Info (Blue)</option>
          <option value="error">Error (Red)</option>
        </select>
    </div>
  </div>
);

// 3. Register the Component
ComponentRegistry.register({
  type: 'custom-alert',   // Unique ID
  name: 'Alert Box',      // Display Name
  icon: Star,             // Icon Component
  group: 'basic',         // Sidebar Group
  render: AlertBox,       // The Renderer
  propertiesPanel: AlertProps // The Custom Settings Panel
});
```

### Exporting HTML

You can programmatically trigger the HTML export (for example, via a custom toolbar button in your wrapper app). This utility generates a standalone `index.html` file containing the page structure and Tailwind CSS CDN.

```tsx
import { exportHtml } from 'buildflow-react';

const handleExport = () => {
    // 1. Prepare Data
    const htmlContent = exportHtml(
        elements,           // Current page elements (state)
        savedTemplates,     // Saved templates (state)
        "My Website",       // Page Title
        "Generated Site",   // Page Description
        "MAPS_API_KEY",     // (Optional) Google Maps API Key
        "RECAPTCHA_KEY"     // (Optional) Google Recaptcha v2 Site Key
    );
    
    // 2. Trigger Download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    
    // 3. Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
```

## 💻 Local Development

If you want to run this repository locally to contribute or modify the source code:

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/your-username/buildflow-react.git
    cd buildflow-react
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start Dev Server**:
    Runs the demo app (`App.tsx`) with Hot Module Replacement.
    ```bash
    npm run dev
    ```

4.  **Build Library**:
    Compiles the project into a distributable library in `dist/`.
    ```bash
    npm run build
    ```

## 🛠 Tech Stack
*   **Frontend**: React, TypeScript
*   **Styling**: Tailwind CSS
*   **Architecture**: Component-based recursive rendering.