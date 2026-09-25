import React from 'react';
import { I18nProvider } from './context/I18nContext';
import { AppShell } from './components/layout/AppShell';

export default function App() {
  return (
    <I18nProvider>
      <AppShell />
    </I18nProvider>
  );
}
