

export const TAILWIND_CLASSES = [
  // Layout
  'container', 'flex', 'inline-flex', 'grid', 'block', 'inline-block', 'hidden',
  'flex-row', 'flex-col', 'flex-wrap', 'flex-nowrap',
  'items-start', 'items-center', 'items-end', 'items-stretch', 'items-baseline',
  'justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around', 'justify-evenly',
  'gap-0', 'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8', 'gap-10', 'gap-12', 'gap-16',
  'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6', 'grid-cols-12',
  'col-span-1', 'col-span-2', 'col-span-3', 'col-span-4', 'col-span-6', 'col-span-12', 'col-span-full',
  
  // Spacing (Padding & Margin) - 0 to 96
  'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12', 'p-16', 'p-20', 'p-24',
  'px-0', 'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8', 'px-10', 'px-12', 'px-16',
  'py-0', 'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6', 'py-8', 'py-10', 'py-12', 'py-16',
  'pt-2', 'pt-4', 'pt-6', 'pt-8', 'pb-2', 'pb-4', 'pb-6', 'pb-8',
  'm-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-12', 'm-auto',
  'mx-0', 'mx-1', 'mx-2', 'mx-4', 'mx-auto', 'mx-6', 'mx-8',
  'my-0', 'my-1', 'my-2', 'my-4', 'my-auto', 'my-6', 'my-8',
  'mt-2', 'mt-4', 'mt-6', 'mt-8', 'mb-2', 'mb-4', 'mb-6', 'mb-8',
  
  // Sizing
  'w-full', 'w-screen', 'w-auto', 'w-1/2', 'w-1/3', 'w-2/3', 'w-1/4', 'w-3/4', 'w-1/5',
  'h-full', 'h-screen', 'h-auto', 'h-1/2', 'h-1/3', 'h-2/3', 'min-h-screen', 'min-h-0', 'min-h-full',
  'max-w-xs', 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-7xl', 'max-w-full',
  
  // Typography
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl',
  'font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black',
  'text-left', 'text-center', 'text-right', 'text-justify',
  'uppercase', 'lowercase', 'capitalize', 'normal-case',
  'italic', 'not-italic', 'underline', 'no-underline', 'line-through',
  'leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose',
  'tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest',

  // Colors - Text
  'text-inherit', 'text-current', 'text-transparent', 'text-black', 'text-white',
  ...['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'].flatMap(color => [
      `text-${color}-50`, `text-${color}-100`, `text-${color}-200`, `text-${color}-300`, `text-${color}-400`, `text-${color}-500`, `text-${color}-600`, `text-${color}-700`, `text-${color}-800`, `text-${color}-900`, `text-${color}-950`
  ]),

  // Colors - Background
  'bg-inherit', 'bg-current', 'bg-transparent', 'bg-black', 'bg-white',
  ...['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'].flatMap(color => [
      `bg-${color}-50`, `bg-${color}-100`, `bg-${color}-200`, `bg-${color}-300`, `bg-${color}-400`, `bg-${color}-500`, `bg-${color}-600`, `bg-${color}-700`, `bg-${color}-800`, `bg-${color}-900`, `bg-${color}-950`
  ]),
  'bg-cover', 'bg-contain', 'bg-auto', 'bg-center', 'bg-top', 'bg-bottom', 'bg-left', 'bg-right', 'bg-no-repeat', 'bg-repeat',

  // Borders
  'border', 'border-0', 'border-2', 'border-4', 'border-8',
  'border-solid', 'border-dashed', 'border-dotted', 'border-double', 'border-none',
  'rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full',
  ...['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'].flatMap(color => [
      `border-${color}-200`, `border-${color}-300`, `border-${color}-400`, `border-${color}-500`, `border-${color}-600`
  ]),
  
  // Effects
  'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner', 'shadow-none',
  'opacity-0', 'opacity-5', 'opacity-10', 'opacity-20', 'opacity-25', 'opacity-30', 'opacity-40', 'opacity-50', 'opacity-60', 'opacity-70', 'opacity-75', 'opacity-80', 'opacity-90', 'opacity-95', 'opacity-100',
  'transition-none', 'transition-all', 'transition', 'transition-colors', 'transition-opacity', 'transition-shadow', 'transition-transform',
  'duration-75', 'duration-100', 'duration-150', 'duration-200', 'duration-300', 'duration-500', 'duration-700', 'duration-1000',
  'ease-linear', 'ease-in', 'ease-out', 'ease-in-out',
  
  // Hover States (Common)
  'hover:opacity-100', 'hover:opacity-80', 'hover:opacity-50',
  'hover:shadow-md', 'hover:shadow-lg', 'hover:shadow-xl',
  'hover:scale-105', 'hover:scale-110', 'hover:-translate-y-1', 'hover:-translate-y-2',
  'hover:text-indigo-600', 'hover:text-blue-600', 'hover:text-white',
  'hover:bg-indigo-600', 'hover:bg-indigo-700', 'hover:bg-gray-100', 'hover:bg-gray-200', 'hover:bg-gray-800',

  // Positioning & Layout Extras
  'relative', 'absolute', 'fixed', 'sticky', 
  'top-0', 'right-0', 'bottom-0', 'left-0', 
  'inset-0', 'inset-x-0', 'inset-y-0',
  'z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50', 'z-auto',
  'overflow-auto', 'overflow-hidden', 'overflow-visible', 'overflow-scroll',
  'visible', 'invisible',
  'cursor-auto', 'cursor-default', 'cursor-pointer', 'cursor-wait', 'cursor-text', 'cursor-move', 'cursor-not-allowed'
];