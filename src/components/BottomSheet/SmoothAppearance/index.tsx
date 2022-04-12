import React, { useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import { ReusablePropsContext } from '../../../containers/ReusablePropsProvider';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';
import { onRenderSmoothAppearance } from '../../../worklets';

interface SmoothAppearanceProps {
  children: React.ReactNode;
}

const SmoothAppearance: React.FC<SmoothAppearanceProps> = ({ children }) => {
  const { headerHeight, contentHeight, smoothAppearanceClock } = useContext(
    ReusablePropsContext.bottomSheet,
  );
  const { smoothAppearance } = useContext(UserConfigurationContext);

  const hasSmoothAppearance = typeof smoothAppearance?.waitForContent === 'boolean';
  const { waitForContent } = smoothAppearance ?? {};

  const isSmoothAppearanceAnimationRunning = useSharedValue(false);
  const { width: windowWidth } = useWindowDimensions();

  useAnimatedReaction(
    () => ({
      headerHeight,
      contentHeight,
    }),
    res => {
      onRenderSmoothAppearance({
        headerHeight: res.headerHeight,
        contentHeight: res.contentHeight,
        isSmoothAppearanceAnimationRunning,
        smoothAppearanceClock,
        shouldWaitForContent: waitForContent,
      });
    },
    [headerHeight, contentHeight, hasSmoothAppearance],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: interpolate(smoothAppearanceClock.value, [0, 20], [0, 1]),
    transform: [
      {
        translateY: interpolate(smoothAppearanceClock.value, [0, 20], [20, 0]),
      },
    ],
  }));

  const normalStyle = useAnimatedStyle(() => ({
    width: windowWidth,
  }));

  return (
    <Animated.View style={hasSmoothAppearance ? animatedStyle : normalStyle}>
      {children}
    </Animated.View>
  );
};

export default SmoothAppearance;
