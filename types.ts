

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

export interface GalleryImage {
    id: string;
    src: string;
    alt?: string;
}

export interface TestimonialItem {
    id: string;
    content: string;
    author: string;
    role: string;
    avatarSrc?: string;
    rating: number;
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
    parallax?: boolean;
    videoUrl?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    autoplay?: boolean;
    controls?: boolean;
    listType?: 'ul' | 'ol';
    listStyleType?: string;
    itemSpacing?: string;
    items?: string[];
    address?: string;
    zoom?: number;
    
    // Gallery Specific
    galleryImages?: GalleryImage[];
    galleryLayout?: 'grid' | 'masonry' | 'flex';
    galleryColumnCount?: number;
    galleryGap?: string;
    galleryAspectRatio?: string; // 'aspect-square', 'aspect-video', 'auto'
    galleryObjectFit?: 'cover' | 'contain' | 'fill';

    // Testimonial Specific
    testimonialItems?: TestimonialItem[];
    testimonialLayout?: 'grid' | 'slider';
    testimonialAvatarSize?: 'sm' | 'md' | 'lg' | 'xl';
    testimonialAvatarShape?: 'circle' | 'square' | 'rounded';
    testimonialBubbleColor?: string;
    testimonialAutoplay?: boolean;
    testimonialInterval?: number;

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
    
    // Card Specific
    cardTitle?: string;
    cardText?: string;
    cardButtonText?: string;
    cardImageType?: 'image' | 'icon';
    cardIcon?: string;
    cardIconColor?: string;
    cardIconSize?: string;
    cardLayout?: 'vertical' | 'horizontal';
    cardHoverEffect?: 'none' | 'lift' | 'zoom' | 'glow' | 'border';
    cardBadge?: string;
    cardLink?: string;

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