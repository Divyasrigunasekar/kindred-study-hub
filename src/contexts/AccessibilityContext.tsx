import React, { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'default' | 'creme' | 'contrast' | 'focus';

interface AccessibilityState {
  openDyslexic: boolean;
  bionicReading: boolean;
  lineSpacing: number;
  theme: Theme;
  toggleDyslexic: () => void;
  toggleBionic: () => void;
  setLineSpacing: (v: number) => void;
  setTheme: (t: Theme) => void;
}

const AccessibilityContext = createContext<AccessibilityState | null>(null);

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
};

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [openDyslexic, setOpenDyslexic] = useState(false);
  const [bionicReading, setBionicReading] = useState(true);
  const [lineSpacing, setLineSpacing] = useState(1.8);
  const [theme, setTheme] = useState<Theme>('default');

  const themeClass = theme === 'default' ? '' : `theme-${theme}`;

  return (
    <AccessibilityContext.Provider
      value={{
        openDyslexic,
        bionicReading,
        lineSpacing,
        theme,
        toggleDyslexic: () => setOpenDyslexic(p => !p),
        toggleBionic: () => setBionicReading(p => !p),
        setLineSpacing,
        setTheme,
      }}
    >
      <div className={`${themeClass} ${openDyslexic ? 'font-opendyslexic' : ''}`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};
