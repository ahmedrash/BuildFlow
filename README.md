
# BuildFlow - Visual Page Builder

BuildFlow is a comprehensive, React-based visual website builder. It enables users to construct responsive, high-performance web pages using an intuitive drag-and-drop interface.

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
import { BuildFlowEditor, PageElement, SavedTemplate } from 'buildflow-react';

// Import BuildFlow styles (Required for animations & layout)
import 'buildflow-react/dist/style.css'; 

const MyBuilderApp = () => {
  const [data, setData] = useState<PageElement[]>([]);
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);

  // 1. Handle Saving the Page
  const handleSave = (elements: PageElement[]) => {
    console.log('Saved page data:', elements);
    setData(elements);
    // API call to save to database...
  };

  // 2. Handle Saving Reusable Templates
  const handleSaveTemplate = (template: SavedTemplate) => {
    setTemplates(prev => [...prev, template]);
    // API call to save template...
  };

  // 3. Handle Deleting Templates
  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // 4. Handle Image Uploads
  const handleUploadImage = async (file: File): Promise<string> => {
    // Mock upload - replace with actual API call (e.g., S3, Cloudinary)
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });
  };

  return (
    <div style={{ height: '100vh' }}>
      <BuildFlowEditor 
        initialData={data}
        savedTemplates={templates}
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
