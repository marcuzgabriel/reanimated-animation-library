import React from 'react';
import Animated from 'react-native-reanimated';
import Sheet from 'components/BottomSheet/Sheet';
import KeyboardProvider from 'containers/KeyboardProvider';
interface Props {
  scrollY: Animated.SharedValue<number>;
  snapEffectDirection?: Animated.SharedValue<string>;
  onLayoutRequest?: (cardHeight: number) => void;
  children: React.ReactNode;
}

const BottomSheet: React.FC<Props> = ({
  scrollY,
  snapEffectDirection,
  onLayoutRequest,
  children,
}) => (
  <KeyboardProvider>
    <Sheet
      scrollY={scrollY}
      snapEffectDirection={snapEffectDirection}
      onLayoutRequest={onLayoutRequest}
    >
      {children}
    </Sheet>
  </KeyboardProvider>
);

export default BottomSheet;
