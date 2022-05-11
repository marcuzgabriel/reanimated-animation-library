import React, { useState } from 'react';
import styled from 'styled-components/native';
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  cancelAnimation,
} from 'react-native-reanimated';
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
  GestureUpdateEvent,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

const HEIGHT = 100;
const WIDTH = 500;
const ABSOLUTE_X_START = 334;
const DEFAULT_SPRING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 120,
  overshootClamping: false,
  restSpeedThreshold: 1,
  restDisplacementThreshold: 1,
};

const TouchableOpacity = styled.TouchableOpacity`
  flex: 1;
`;

const Wrapper = styled.View`
  width: 100%;
  height: ${HEIGHT}px;
  justify-content: center;
  align-items: center;
`;

const ToggleWrapper = styled.View`
  width: ${WIDTH}px;
  height: 100%;
  border-radius: 7px;
  background-color: lightgrey;
`;

const RowWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  padding: 16px;
`;

const ToggleItem = styled.View<{ isVisible?: boolean }>`
  flex: 1;
  z-index: -1;
`;

const Toggle: React.FC = () => {
  const animationClock = useSharedValue(0);
  const startX = useSharedValue(0);
  const translationX = useSharedValue(0);
  const prevDragX = useSharedValue(0);
  const dragX = useSharedValue(0);
  const isAnimationRunning = useSharedValue(false);
  const isPanGestureActive = useSharedValue(true);
  const isToggleActive = useSharedValue(false);
  const startXAbsolute = useSharedValue<Number | undefined>(undefined);
  const diff = WIDTH / 2;

  const panGestureOnBegin = (e): void => {
    'worklet';

    // if (isAnimationRunning.value) {
    //   cancelAnimation(translationX);
    // }

    startX.value = translationX.value;
  };

  const panGestureOnUpdate = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>): void => {
    'worklet';

    if (!isToggleActive.value) {
      translationX.value = e.translationX >= 0 ? startX.value + e.translationX : 0;
    } else {
      translationX.value = e.translationX <= diff - 16 ? startX.value + e.translationX : 0;
    }
  };

  const panGestureOnEnd = (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>): void => {
    'worklet';

    isToggleActive.value = !isToggleActive.value;
    isAnimationRunning.value = true;

    translationX.value = withSpring(
      isToggleActive.value ? diff - 16 : 0,
      DEFAULT_SPRING_CONFIG,
      isAnimationComplete => {
        if (isAnimationComplete) {
          isAnimationRunning.value = false;
        }
      },
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    width: '100%',
    height: '100%',
    borderRadius: 7,
    backgroundColor: 'yellow',
    boxShadow: '3px 7px 10px rgba(0, 0, 0, 0.25)',
    transform: [
      {
        translateX: translationX.value,
      },
    ],
  }));

  const panGestureHandler = Gesture.Pan()
    .onBegin(panGestureOnBegin)
    .onUpdate(panGestureOnUpdate)
    .onEnd(panGestureOnEnd);

  return (
    <GestureHandlerRootView>
      <Wrapper>
        <ToggleWrapper>
          <RowWrapper>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                'worklet';

                if (isAnimationRunning.value) {
                  cancelAnimation(translationX);
                  isAnimationRunning.value = false;
                }

                if (!isAnimationRunning.value) {
                  isToggleActive.value = !isToggleActive.value;
                  translationX.value = withSpring(
                    isToggleActive.value ? diff - 16 : 0,
                    DEFAULT_SPRING_CONFIG,
                  );
                }
              }}
            >
              <GestureDetector gesture={panGestureHandler}>
                <Animated.View style={animatedStyle} />
              </GestureDetector>
            </TouchableOpacity>
            <ToggleItem />
          </RowWrapper>
        </ToggleWrapper>
      </Wrapper>
    </GestureHandlerRootView>
  );
};

export default Toggle;
