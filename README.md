
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

BuildFlow supports a **Registry Pattern** for adding custom components without forking the library.

**Example:**
```tsx
import { ComponentRegistry } from 'buildflow-react';
import { Star } from 'lucide-react'; // Or your own icon

ComponentRegistry.register({
  type: 'custom-alert',
  name: 'Alert Box',
  icon: Star,
  group: 'basic',
  render: ({ element }) => (
    <div className="bg-red-100 p-4 border-l-4 border-red-500 text-red-700">
      <h3 className="font-bold">Alert!</h3>
      <p>{element.props.content || 'Default warning text'}</p>
    </div>
  )
});
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
