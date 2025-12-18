
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
  | 'input'     
  | 'textarea'  
  | 'select'    
  | 'radio'     
  | 'checkbox'  
  | 'gallery' 
  | 'navbar' 
  | 'logo'      
  | 'menu'      
  | 'testimonial' 
  | 'card'
  | 'slider'
  | 'global'
  | 'customScript';

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

export interface NavLinkItem {
    id: string;
    label: string;
    href?: string;
    target?: '_self' | '_blank';
    type?: 'link' | 'dropdown' | 'popup' | 'mega-menu';
    targetId?: string; // For popup or mega-menu
    megaMenuPlacement?: 'left' | 'center' | 'right'; 
    triggerType?: 'click' | 'hover'; // For mega-menu
    children?: NavLinkItem[];
}

export interface ListItem {
    id: string;
    text: string;
    href?: string;
    target?: '_self' | '_blank';
    iconLeft?: string;
    iconRight?: string;
}

export interface SavedTemplate {
    id: string;
    name: string;
    isGlobal: boolean;
    element: PageElement;
}

export interface AnimationSettings {
    type: 'none' | 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'slide-in-left' | 'slide-in-right' | 'zoom-in' | 'rotate-in';
    duration?: number;
    delay?: number;
    ease?: string;
    stagger?: number; // For children
    target?: 'self' | 'children';
    viewport?: number; // threshold percentage
    trigger?: 'scroll' | 'load';
}

export interface PageElement {
  id: string;
  type: ElementType;
  name: string;
  props: {
    // Visibility
    isHidden?: boolean;

    // Content
    content?: string;
    src?: string;
    alt?: string;
    href?: string;
    
    // Global Template Specific
    templateId?: string;
    
    // Animation
    animation?: AnimationSettings;

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
    items?: string[]; // Legacy simple strings
    listItems?: ListItem[]; // New structured items
    
    // Map Specific
    address?: string;
    zoom?: number;
    mapType?: 'roadmap' | 'satellite';

    // Image Specific
    imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    imageHeight?: string;
    
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

    // Form Container Specific
    formActionUrl?: string;     
    formThankYouUrl?: string;   
    formSuccessMessage?: string;
    formEnableRecaptcha?: boolean;
    formLabelLayout?: 'top' | 'horizontal'; // Maps to flex-col vs flex-row
    
    // Legacy Monolithic Form (Deprecated for new forms but kept for types)
    formFields?: FormField[];
    formEmailTo?: string;
    formSubmitButtonText?: string;
    formInputBorderRadius?: string;
    formInputBackgroundColor?: string;
    formButtonBackgroundColor?: string;
    formButtonTextColor?: string;

    // New Individual Form Elements
    fieldName?: string;
    fieldLabel?: string;
    fieldPlaceholder?: string;
    fieldRequired?: boolean;
    fieldDefaultValue?: string;
    fieldHidden?: boolean;
    fieldValue?: string;
    fieldMultiple?: boolean;
    inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'hidden';
    fieldOptions?: { label: string; value: string }[];
    fieldRows?: number;
    checked?: boolean;

    // Navbar Specific
    headerType?: 'relative' | 'fixed' | 'sticky'; 
    stickyOffset?: number; 
    
    // Menu Specific
    navLinks?: NavLinkItem[]; 
    navOrientation?: 'horizontal' | 'vertical';
    linkColor?: string;
    activeLinkColor?: string;
    hamburgerColor?: string;
    mobileMenuBreakpoint?: 'sm' | 'md' | 'lg' | 'none';
    mobileMenuType?: 'dropdown' | 'slide-left' | 'slide-right';
    mobileMenuIconType?: 'menu' | 'grid' | 'dots';
    menuBackgroundColor?: string;

    // Logo Specific
    logoType?: 'text' | 'image';
    logoText?: string;
    logoSrc?: string;
    logoWidth?: string;
    
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
    
    // Custom Script
    scriptContent?: string;

    // Button Specific
    buttonAction?: 'link' | 'submit' | 'popup';
    popupTargetId?: string; // New: Target element ID for popups
    target?: '_self' | '_blank';
    buttonIconLeft?: string;
    buttonIconRight?: string;
    buttonIsIconOnly?: boolean;

    // Slider Specific
    sliderItems?: { src: string; caption?: string; content?: string }[];
    sliderAutoplay?: boolean;
    sliderInterval?: number;
    sliderNavType?: 'chevron' | 'arrow' | 'caret';
    sliderActiveIndex?: number;
    sliderShowPagination?: boolean;
    sliderTransition?: 'fade' | 'zoom' | 'slide-up'; 

    // Styles
    style?: ElementStyle;
    className?: string;
    
    // Inner Element Styles (Split Design)
    elementStyle?: ElementStyle;
    elementClassName?: string;
  };
  children?: PageElement[];
}

export interface BuildFlowEditorProps {
    initialData?: PageElement[];
    savedTemplates?: SavedTemplate[];
    onSave?: (elements: PageElement[], templates?: SavedTemplate[]) => void;
    onSaveTemplate?: (template: SavedTemplate) => void;
    onDeleteTemplate?: (id: string) => void;
    onUploadImage?: (file: File) => Promise<string>;
    
    // API Keys
    googleMapsApiKey?: string;
    recaptchaSiteKey?: string;
}
