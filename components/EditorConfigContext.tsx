
import React from 'react';

export interface EditorConfig {
    googleMapsApiKey?: string;
    recaptchaSiteKey?: string;
}

export const EditorConfigContext = React.createContext<EditorConfig>({});
