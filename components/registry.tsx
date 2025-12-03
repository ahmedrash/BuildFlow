import React from 'react';
import { PageElement } from '../types';

export interface ComponentDefinition {
  type: string;
  name: string;
  icon: React.FC<any>;
  group: 'layout' | 'basic' | 'media' | 'form' | 'advanced';
  render: React.FC<{ element: PageElement; isPreview: boolean }>;
  propertiesPanel?: React.FC<{ element: PageElement; onUpdateProps: (id: string, props: any) => void; }>;
}

class Registry {
  private components = new Map<string, ComponentDefinition>();

  register(def: ComponentDefinition) {
    this.components.set(def.type, def);
  }

  get(type: string) {
    return this.components.get(type);
  }

  getAll() {
    return Array.from(this.components.values());
  }
}

export const ComponentRegistry = new Registry();