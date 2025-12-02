

import React from 'react';
import { PageElement } from '../types';

export interface EditorConfig {
    googleMapsApiKey?: string;
    recaptchaSiteKey?: string;
}

export const EditorConfigContext = React.createContext<EditorConfig>({});

export const PopupContext = React.createContext<{
    openPopup: (id: string) => void;
    popupTargets: Set<string>;
}>({ openPopup: () => {}, popupTargets: new Set() });

export const PageContext = React.createContext<{
    findElement: (id: string) => PageElement | null;
}>({ findElement: () => null });