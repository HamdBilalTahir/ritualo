import React from 'react';
import { useMode } from '../../src/theme/ThemeContext';
import HomeParent from '../../src/screens/HomeParent';
import HomeKid from '../../src/screens/HomeKid';

export default function Home() {
  const mode = useMode();
  return mode === 'kid' ? <HomeKid /> : <HomeParent />;
}
