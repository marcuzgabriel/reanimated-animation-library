import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LoremIpsum } from './components/Ipsum';
import {
  Gesture,
  GestureDetector,
  PanGestureHandlerEventPayload,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const HEADER_HEIGTH = 50;
const windowHeight = Dimensions.get('window').height;
const SNAP_POINTS_FROM_TOP = [50, windowHeight * 0.4, windowHeight * 0.8];

const FULLY_OPEN_SNAP_POINT = SNAP_POINTS_FROM_TOP[0];
const CLOSED_SNAP_POINT = SNAP_POINTS_FROM_TOP[SNAP_POINTS_FROM_TOP.length - 1];

const RNGH20: React.FC = () => {
  const panGestureRef = useRef(Gesture.Pan());
  const blockScrollUntilAtTheTopRef = useRef(Gesture.Tap());
  const [snapPoint, setSnapPoint] = useState(CLOSED_SNAP_POINT);
  const translationY = useSharedValue(0);
  const scrollOffset = useSharedValue(0);
  const bottomSheetTranslateY = useSharedValue(CLOSED_SNAP_POINT);

  const onHandlerEndOnJS = (point: number): any => {
    setSnapPoint(point);
  };
  const onHandlerEnd = ({ velocityY }: PanGestureHandlerEventPayload): any => {
    'worklet';
    const dragToss = 0.05;
    const endOffsetY = bottomSheetTranslateY.value + translationY.value + velocityY * dragToss;

    // calculate nearest snap point
    let destSnapPoint = FULLY_OPEN_SNAP_POINT;

    if (snapPoint === FULLY_OPEN_SNAP_POINT && endOffsetY < FULLY_OPEN_SNAP_POINT) {
      return;
    }

    for (const snapPointTest of SNAP_POINTS_FROM_TOP) {
      const distFromSnap = Math.abs(snapPointTest - endOffsetY);
      if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
        destSnapPoint = snapPointTest;
      }
    }

    // update current translation to be able to animate withSpring to snapPoint
    bottomSheetTranslateY.value = bottomSheetTranslateY.value + translationY.value;
    translationY.value = 0;

    bottomSheetTranslateY.value = withSpring(destSnapPoint, {
      mass: 0.5,
    });

    runOnJS(onHandlerEndOnJS)(destSnapPoint);
  };

  const panGesture = Gesture.Pan().onUpdate(e => {
    // when bottom sheet is not fully opened scroll offset should not influence
    // its position (prevents random snapping when opening bottom sheet when
    // the content is already scrolled)
    // if (snapPoint === FULLY_OPEN_SNAP_POINT) {
    //   translationY.value = e.translationY - scrollOffset.value;
    // } else {
    //   translationY.value = e.translationY;
    // }
  });

  const blockScrollUntilAtTheTop = Gesture.Tap().withRef(blockScrollUntilAtTheTopRef);

  const headerGesture = Gesture.Pan()
    .onUpdate(e => {
      console.log('...');
      translationY.value = e.translationY;
    })
    .onEnd(onHandlerEnd)
    .withRef(panGestureRef);

  const scrollViewGesture = Gesture.Native().requireExternalGestureToFail(blockScrollUntilAtTheTop);

  const bottomSheetAnimatedStyle = useAnimatedStyle(() => {
    const translateY = bottomSheetTranslateY.value + translationY.value;

    const minTranslateY = Math.max(FULLY_OPEN_SNAP_POINT, translateY);
    const clampedTranslateY = Math.min(CLOSED_SNAP_POINT, minTranslateY);
    return {
      transform: [{ translateY: clampedTranslateY }],
    };
  });

  useEffect(() => {
    if (panGestureRef?.current) {
      console.log('...');
    }
  });

  return (
    <View style={styles.container}>
      <LoremIpsum words={200} />
      <GestureDetector gesture={headerGesture}>
        <Animated.View style={[styles.bottomSheet, bottomSheetAnimatedStyle]}>
          <Animated.ScrollView
            bounces={false}
            scrollEventThrottle={1}
            onScrollBeginDrag={(e): any => {
              console.log('..');
              scrollOffset.value = e.nativeEvent.contentOffset.y;
            }}
          >
            <LoremIpsum />
            <LoremIpsum />
            <LoremIpsum />
          </Animated.ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef',
  },
  header: {
    height: HEADER_HEIGTH,
    backgroundColor: 'coral',
  },
  bottomSheet: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ff9f7A',
  },
});

export default RNGH20;
