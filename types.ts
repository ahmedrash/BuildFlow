

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
  | 'input'     // New
  | 'textarea'  // New
  | 'select'    // New
  | 'radio'     // New
  | 'checkbox'  // New
  | 'gallery' 
  | 'navbar' 
  | 'logo'      // New
  | 'menu'      // New
  | 'testimonial' 
  | 'card'
  | 'slider'
  | 'global';

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
    // Visibility
    isHidden?: boolean;

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
    formActionUrl?: string;     // New
    formThankYouUrl?: string;   // New
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
    headerType?: 'relative' | 'fixed' | 'sticky'; // Replaces isSticky for more control
    stickyOffset?: number; // Scroll amount before sticking
    
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
    
    // Button Specific
    buttonAction?: 'link' | 'submit' | 'popup';
    popupTargetId?: string; // New: Target element ID for popups
    target?: '_self' | '_blank';

    // Slider Specific
    sliderItems?: { src: string; caption?: string; content?: string }[];
    sliderAutoplay?: boolean;
    sliderInterval?: number;
    sliderNavType?: 'chevron' | 'arrow' | 'caret';
    sliderActiveIndex?: number;
    sliderShowPagination?: boolean;
    sliderTransition?: 'fade' | 'zoom' | 'slide-up'; // New

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
    onSave?: (elements: PageElement[]) => void;
    onSaveTemplate?: (template: SavedTemplate) => void;
    onDeleteTemplate?: (id: string) => void;
    onUploadImage?: (file: File) => Promise<string>;
    
    // API Keys
    googleMapsApiKey?: string;
    recaptchaSiteKey?: string;
}