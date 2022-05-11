import React, { useRef } from 'react';
import styled from 'styled-components/native';
import Animated, { withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
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
  const isPanGestureActive = useSharedValue(true);
  const startXAbsolute = useSharedValue<Number | undefined>(undefined);

  const panGestureOnBegin = (e): void => {
    'worklet';

    startX.value = translationX.value;
  };

  const panGestureOnUpdate = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>): void => {
    'worklet';

    if (!startXAbsolute.value) {
      startXAbsolute.value = e.absoluteX;
    }

    if (translationX.value >= 0) {
      translationX.value = startX.value + e.translationX;
    }
  };

  const panGestureOnEnd = (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>): void => {
    'worklet';

    translationX.value = withSpring(WIDTH / 2 - 16, DEFAULT_SPRING_CONFIG);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    height: '100%',
    borderRadius: 7,
    border: '1px solid red',
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
              onPress={() => {
                'worklet';
                translationX.value = withSpring(WIDTH / 2 - 16, DEFAULT_SPRING_CONFIG);
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
