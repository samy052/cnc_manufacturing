'use client';

import React from 'react';
import { FoundryProvider } from '@/context/FoundryContext';
import Shell from '@/components/layout/Shell';

export default function Home() {
  return (
    <FoundryProvider>
      <Shell />
    </FoundryProvider>
  );
}
