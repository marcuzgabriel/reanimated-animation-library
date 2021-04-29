import React from 'react';
import Animated from 'react-native-reanimated';
import NewSchool from './NewSchool';
interface Props {
  scrollY: Animated.SharedValue<number>;
  windowHeight: number;
}

const BottomSheet: React.FC<Props> = ({ scrollY }) => <NewSchool scrollY={scrollY} />;

export default BottomSheet;
