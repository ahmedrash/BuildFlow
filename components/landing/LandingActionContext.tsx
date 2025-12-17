
import React, { createContext } from 'react';

export interface LandingActionContextProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const LandingActionContext = createContext<LandingActionContextProps>({
  onLogin: () => console.log('Login triggered'),
  onRegister: () => console.log('Register triggered'),
});
