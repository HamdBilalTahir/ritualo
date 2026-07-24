import React, { createContext, useContext, useMemo } from 'react';
import { colorsFor, Mode } from './tokens';

const ModeContext = createContext<{ mode: Mode }>({ mode: 'parent' });

export function ModeProvider({ mode, children }: { mode: Mode; children: React.ReactNode }) {
  const value = useMemo(() => ({ mode }), [mode]);
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  return useContext(ModeContext).mode;
}

export function useColors() {
  const mode = useMode();
  return useMemo(() => colorsFor(mode), [mode]);
}
