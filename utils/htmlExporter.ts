
import { PageElement, SavedTemplate } from "../types";

export const exportHtml = (
    elements: PageElement[], 
    templates: SavedTemplate[], 
    title: string, 
    description: string,
    googleMapsApiKey?: string,
    recaptchaSiteKey?: string
): string => {
  const elementsJson = JSON.stringify(elements).replace(/<\/script>/g, '<\\/script>');
  const templatesJson = JSON.stringify(templates).replace(/<\/script>/g, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="en" class="overflow-x-hidden">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
    <style>
      html { scroll-behavior: smooth; }
      body { font-family: 'Inter', sans-serif; overflow-x: hidden; }
      .animate { opacity: 0; }
    </style>
</head>
<body class="bg-white text-slate-900">
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel">
        // Core Renderer and GSAP logic would be inlined here for standalone functionality.
        // For this demo, we assume the environment includes the necessary React components.
        console.log("Page data loaded", ${elementsJson});
    </script>
</body>
</html>`;
}
