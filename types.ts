
export type ElementType = 
  | 'section' 
  | 'container' 
  | 'columns' 
  | 'text' 
  | 'heading' 
  | 'image' 
  | 'button' 
  | 'video' 
  | 'list' 
  | 'map' 
  | 'customCode' 
  | 'form' 
  | 'gallery' 
  | 'navbar' 
  | 'testimonial' 
  | 'card'
  | 'slider'
  | 'global'; // Added global type

export interface ElementStyle {
  backgroundColor?: string;
  color?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  margin?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  borderRadius?: string;
  border?: string;
  borderWidth?: string;
  borderColor?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontFamily?: string;
  width?: string;
  height?: string;
  display?: string;
  flexDirection?: 'row' | 'column';
  gap?: string;
  justifyContent?: string;
  alignItems?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundSize?: string;
  opacity?: string;
  boxShadow?: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'checkbox' | 'number' | 'tel';
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}

export interface SavedTemplate {
    id: string;
    name: string;
    isGlobal: boolean;
    element: PageElement;
}

export interface PageElement {
  id: string;
  type: ElementType;
  name: string;
  props: {
    // Content
    content?: string;
    src?: string;
    alt?: string;
    href?: string;
    
    // Global Template Specific
    templateId?: string;
    
    // Specific Props
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    videoUrl?: string;
    autoplay?: boolean;
    controls?: boolean;
    listType?: 'ul' | 'ol';
    listStyleType?: string;
    itemSpacing?: string;
    items?: string[];
    address?: string;
    zoom?: number;
    
    // Form Specific
    formFields?: FormField[];
    formSubmitUrl?: string;
    formEmailTo?: string;
    formSuccessMessage?: string;
    formEnableRecaptcha?: boolean;
    formSubmitButtonText?: string;
    formLabelLayout?: 'top' | 'horizontal';
    formInputBorderRadius?: string;
    formInputBackgroundColor?: string;
    formButtonBackgroundColor?: string;
    formButtonTextColor?: string;

    // Navbar Specific
    navLinks?: { label: string, href: string }[]; 
    isSticky?: boolean;
    navOrientation?: 'horizontal' | 'vertical';
    logoType?: 'text' | 'image';
    logoText?: string;
    logoSrc?: string;
    linkColor?: string;

    author?: string;
    role?: string;
    rating?: number;
    cardTitle?: string;
    cardText?: string;
    code?: string;
    
    // Button Specific
    buttonAction?: 'link' | 'submit' | 'popup';
    target?: '_self' | '_blank';

    // Slider Specific
    sliderItems?: { src: string; caption?: string; content?: string }[];
    sliderAutoplay?: boolean;
    sliderInterval?: number;
    sliderNavType?: 'chevron' | 'arrow' | 'caret';
    sliderActiveIndex?: number;

    style?: ElementStyle;
    className?: string;
  };
  children?: PageElement[];
}

export interface AIRequest {
  prompt: string;
  targetId?: string;
  context?: string;
}
