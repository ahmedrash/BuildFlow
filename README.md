# BuildFlow 🚀

**Advanced Visual Page Builder for React & Tailwind CSS**

BuildFlow is a professional-grade, open-source visual website builder. It bridges the gap between high-fidelity design tools and production-ready React code. Powered by **GSAP** for motion and **Tailwind JIT** for styling, it enables designers and developers to create stunning, high-performance web experiences without leaving the browser.

**[Live Demo](https://buildfloweditor.netlify.app)**
---

## 💎 Core Pillars

### 1. Motion Engine (GSAP + ScrollTrigger)
Unlike basic builders with simple CSS transitions, BuildFlow features a deep integration with the **GreenSock Animation Platform**.
- **Scroll-Triggered Masterpieces**: Bind animations to scroll progress with pixel-perfect entry points.
- **Visual Timeline Control**: Effortlessly set easing (Bounce, Elastic, Power4), staggering, and duration.
- **Smart Staggering**: Target "Children" in the properties panel to automatically stagger entrance animations for grid items or lists.

### 2. Global Component Architecture
Stop repeating yourself. BuildFlow introduces a "Master-Instance" relationship for design elements.
- **Global Components**: Save any section as a Global Component. Update the master, and every instance across your entire site updates instantly.
- **Detachable Instances**: Need one specific variation? Detach a global instance to turn it back into a standard editable element.

### 3. Tailwind CSS JIT Editor
Built for the modern web. Every element's style is ultimately powered by Tailwind.
- **Utility-First**: Use the built-in Tailwind autocomplete to add complex classes like `backdrop-blur-md` or `group-hover:scale-110`.
- **Hybrid Styling**: Combine the visual property panel with raw Tailwind classes for ultimate flexibility.

---

## 🛠 Features at a Glance

- 🏗 **Nested Drag & Drop**: Deeply nested structures (Columns within Cards within Sections).
- 🌲 **Layers Panel**: A Photoshop-style tree view to manage complex DOM structures easily.
- 📱 **Responsive Viewports**: Native previewing for Desktop, Tablet (768px), and Mobile (375px).
- 🖼 **Masonry & Grid Galleries**: Built-in high-performance gallery layouts.
- 폼 **Smart Forms**: A granular form builder that generates accessible, stylable `<form>` structures.
- 🧭 **Mega Menus & Popups**: Use the "Popup Target" system to trigger any container ID as a modal or menu overlay.
- 💾 **State Persistence**: Built-in Undo/Redo history (Ctrl+Z / Ctrl+Y).
- 📤 **Clean Export**: Export your creation as a standalone, production-ready HTML/React bundle.

---

## 🚀 Getting Started

### Installation

```bash
npm install buildflow-react gsap @gsap/react lucide-react
```

### Basic Usage

```tsx
import { BuildFlowEditor } from 'buildflow-react';

const MyApp = () => {
  const handleSave = (data) => {
    console.log("Saved Layout:", data);
  };

  return (
    <BuildFlowEditor 
      onSave={handleSave}
      initialData={[]} 
    />
  );
};
```

---

## 🔌 Extending with Custom Components

You can register your own React components into the BuildFlow registry. They will appear in the sidebar and be fully draggable.

```tsx
import { ComponentRegistry, Icons } from 'buildflow-react';

ComponentRegistry.register({
  type: 'custom-hero',
  name: 'Premium Hero',
  group: 'layout',
  icon: Icons.Star,
  render: ({ element, isPreview }) => (
    <section className="bg-indigo-900 p-20 text-white rounded-3xl">
      <h1 className="text-5xl font-black">{element.props.content}</h1>
      {/* BuildFlow can still render children inside your custom component */}
      <div className="mt-8">
        {element.children?.map(child => <ChildWrapper element={child} isPreview={isPreview} />)}
      </div>
    </section>
  )
});
```

---

## 🏗 Tech Stack

- **Framework**: React 19 (Compatible with 18+)
- **Styling**: Tailwind CSS (Runtime JIT)
- **Animation**: GSAP 3.12+ & ScrollTrigger
- **Icons**: Lucide React
- **State**: React Context + Custom History Hook
- **Bundler**: Vite

## 📄 License

MIT © [Rashed Ahmed](https://github.com/ahmedrash)