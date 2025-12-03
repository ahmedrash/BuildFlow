
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

The `BuildFlowEditor` is the main interface for creating pages.

```tsx
import React, { useState } from 'react';
import { BuildFlowEditor, PageElement } from 'buildflow-react';

const MyBuilderApp = () => {
  const [data, setData] = useState<PageElement[]>([]);

  const handleSave = (elements: PageElement[]) => {
    console.log('Saved page data:', elements);
    setData(elements);
  };

  return (
    <div style={{ height: '100vh' }}>
      <BuildFlowEditor 
        initialData={data}
        onSave={handleSave}
        googleMapsApiKey="YOUR_KEY" // Optional
      />
    </div>
  );
};
```

### 3. Using the Renderer

The `BuildFlowRenderer` displays the saved pages to your end users.

```tsx
import { BuildFlowRenderer } from 'buildflow-react';

const MyPage = ({ pageData }) => {
  return (
    <BuildFlowRenderer 
      initialData={pageData} 
    />
  );
};
```

## 🎨 Visual Editor Features
*   **Drag & Drop Interface**: Seamlessly place elements into Sections, Containers, and Columns.
*   **Responsive Design**: Toggle between Desktop, Tablet, and Mobile views.
*   **Real-time Styling**: Instant visual feedback for padding, margins, colors, typography.
*   **Visibility Control**: Toggle hidden elements (Popups, Mega Menus) in the canvas.
*   **Export**: Generate a standalone `index.html` file.

## 🧩 Component Library
*   **Layout**: Sections, Containers, Columns.
*   **Media**: Images, Videos, Sliders, Galleries, Maps.
*   **Forms**: Granular builder (Input, Select, Checkbox) + Smart Containers.
*   **Navigation**: Navbars, Mega Menus, Mobile Drawers.
*   **Interaction**: Popups, Cards, Testimonials.

## 🔌 Extending (Developer Guide)

BuildFlow supports a **Registry Pattern** for adding custom components.

**Example:**
```tsx
import { ComponentRegistry } from 'buildflow-react';
import { Star } from 'lucide-react';

ComponentRegistry.register({
  type: 'custom-alert',
  name: 'Alert Box',
  icon: Star,
  group: 'basic',
  render: ({ element }) => (
    <div className="bg-red-100 p-4 border-l-4 border-red-500">
      {element.props.content}
    </div>
  )
});
```

## 🛠 Tech Stack
*   **Frontend**: React, TypeScript
*   **Styling**: Tailwind CSS
*   **Architecture**: Component-based recursive rendering.
