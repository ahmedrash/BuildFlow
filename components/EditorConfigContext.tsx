

import React from 'react';

export interface EditorConfig {
    googleMapsApiKey?: string;
    recaptchaSiteKey?: string;
}

export const EditorConfigContext = React.createContext<EditorConfig>({});

export const PopupContext = React.createContext<{
    openPopup: (id: string) => void;
    popupTargets: Set<string>;
}>({ openPopup: () => {}, popupTargets: new Set() });