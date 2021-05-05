import React from 'react';
import Animated from 'react-native-reanimated';
import NewSchool from './NewSchool';
import OldSchool from './OldSchool';
interface Props {
  scrollY: Animated.SharedValue<number>;
  scrollYOldSchool: Animated.Value<number>;
  snapEffectDirection?: Animated.SharedValue<string>;
  onLayoutRequest?: (cardHeight: Animated.SharedValue<number>) => void;
}

const BottomSheet: React.FC<Props> = ({ scrollY, snapEffectDirection, onLayoutRequest }) => (
  <NewSchool
    scrollY={scrollY}
    snapEffectDirection={snapEffectDirection}
    onLayoutRequest={onLayoutRequest}
  />
);

export default BottomSheet;
