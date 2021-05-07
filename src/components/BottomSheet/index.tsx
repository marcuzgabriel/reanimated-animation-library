import React from 'react';
import Animated from 'react-native-reanimated';
import NewSchool from './NewSchool';
import OldSchool from './OldSchool';
import KeyboardProviderWrapper from '../../containers/KeyboardProviderWrapper';
interface Props {
  scrollY: Animated.SharedValue<number>;
  scrollYOldSchool: Animated.Value<number>;
  snapEffectDirection?: Animated.SharedValue<string>;
  onLayoutRequest?: (cardHeight: number) => void;
}

const BottomSheet: React.FC<Props> = ({ scrollY, snapEffectDirection, onLayoutRequest }) => (
  <KeyboardProviderWrapper>
    <NewSchool
      scrollY={scrollY}
      snapEffectDirection={snapEffectDirection}
      onLayoutRequest={onLayoutRequest}
    />
  </KeyboardProviderWrapper>
);

export default BottomSheet;
