import React from 'react';
import Animated from 'react-native-reanimated';
import NewSchool from './NewSchool';
import OldSchool from './OldSchool';
interface Props {
  scrollY: Animated.SharedValue<number>;
  scrollYOldSchool: Animated.Value<number>;
  windowHeight: number;
}

const BottomSheet: React.FC<Props> = ({ scrollY, scrollYOldSchool }) => (
  <NewSchool scrollY={scrollY} />
);

export default BottomSheet;
