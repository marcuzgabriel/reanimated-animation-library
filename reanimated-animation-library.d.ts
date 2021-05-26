// Project: https://github.com/marcuzgabriel/reanimated-animation-library
// Typescript Version: 3.7.4

declare module 'reanimated-animation-library' {
  import React from 'react';
  import type { BottomSheetConfiguration } from './src/types/index.d.ts';

  // Components
  export function BottomSheet<P extends BottomSheetConfiguration>(props: P): FunctionComponent<P>;
}
