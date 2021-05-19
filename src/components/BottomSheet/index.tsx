import React from 'react';
import Animated from 'react-native-reanimated';
import Sheet from 'components/BottomSheet/Sheet';
import KeyboardProvider from 'containers/KeyboardProvider';
interface Props {
  scrollY: Animated.SharedValue<number>;
  snapEffectDirection?: Animated.SharedValue<string>;
  contentComponent: React.ReactNode;
  footerComponent: React.ReactNode;
  onLayoutRequest?: (cardHeight: number) => void;
}

const BottomSheet: React.FC<Props> = ({
  scrollY,
  snapEffectDirection,
  contentComponent,
  footerComponent,
  onLayoutRequest,
}) => (
  <KeyboardProvider>
    <Sheet
      scrollY={scrollY}
      snapEffectDirection={snapEffectDirection}
      contentComponent={contentComponent}
      footerComponent={footerComponent}
      onLayoutRequest={onLayoutRequest}
    />
  </KeyboardProvider>
);

export default BottomSheet;
