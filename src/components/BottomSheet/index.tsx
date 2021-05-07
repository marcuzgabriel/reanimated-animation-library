import React from 'react';
import Animated from 'react-native-reanimated';
import Sheet from 'components/BottomSheet/Sheet';
import KeyboardProviderWrapper from 'containers/KeyboardProvider';
interface Props {
  scrollY: Animated.SharedValue<number>;
  snapEffectDirection?: Animated.SharedValue<string>;
  onLayoutRequest?: (cardHeight: number) => void;
}

const BottomSheet: React.FC<Props> = ({ scrollY, snapEffectDirection, onLayoutRequest }) => (
  <KeyboardProviderWrapper>
    <Sheet
      scrollY={scrollY}
      snapEffectDirection={snapEffectDirection}
      onLayoutRequest={onLayoutRequest}
    />
  </KeyboardProviderWrapper>
);

export default BottomSheet;
