import React, { createRef } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, { useSharedValue, Value } from 'react-native-reanimated';
import {
  PanGestureHandlerGestureEvent,
  NativeViewGestureHandler,
  TapGestureHandler,
  PanGestureHandler,
  State as GestureState,
} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import Card from '../Card';
import Header from '../Header';
import { DEFAULT_SNAP_POINT_BOTTOM_RATIO } from '../../constants/animations';

interface BottomSheetState {
  scrollY: Animated.SharedValue<number>;
}

const { event, call, block } = Animated;

const View = styled.View`
  z-index: 2;
`;

export class BottomSheet extends React.Component<Record<string, unknown>, BottomSheetState> {
  private tapGestureHandlerRef = createRef<TapGestureHandler>();
  private panGestureRefHeader = createRef<PanGestureHandler>();
  private panGestureRefContent = createRef<PanGestureHandler>();
  private scrollViewRef = createRef<NativeViewGestureHandler>();

  private gestureState: Value<number>;
  private translationY: Value<number>;
  private velocityY: Value<number>;
  private transY: Value<number>;
  private onGestureEvent: () => void;

  private cardHeight: Value<number>;
  private snapPointBottom: Value<number>;

  constructor(props: Record<string, unknown>) {
    super(props);

    this.gestureState = new Value(0);
    this.translationY = new Value(0);
    this.velocityY = new Value(0);
    this.transY = new Value(0);

    this.cardHeight = new Value(0);
    this.snapPointBottom = new Value(0);

    // this.springConfig = {
    //   damping: 15,
    //   mass: 1,
    //   stiffness: 120,
    //   overshootClamping: false,
    //   restSpeedThreshold: 1,
    //   restDisplacementThreshold: 1,
    //   toValue: new Value(0),
    // };

    // this.springState = {
    //   finished: new Value(0),
    //   velocity: new Value(0),
    //   position: new Value(0),
    //   time: new Value(0),
    // };

    this.onGestureEvent = event(
      [
        {
          nativeEvent: {
            translationY: this.translationY,
            velocityY: this.velocityY,
            state: this.gestureState,
          },
        },
      ],
      { useNativeDriver: true },
    );
  }

  onLayout = (e: LayoutChangeEvent): void => {
    this.cardHeight.setValue(e.nativeEvent.layout.height);
    this.snapPointBottom.setValue(
      e.nativeEvent.layout.height > 0
        ? e.nativeEvent.layout.height * DEFAULT_SNAP_POINT_BOTTOM_RATIO
        : 0,
    );
  };

  runAnimationCode = (): any =>
    Animated.block([
      call([this.snapPointBottom, this.transY, this.cardHeight], vals => {
        console.log('i am working...', vals);
      }),
    ]);

  onScrollHandler = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    console.log(e);
  };

  render(): any {
    const { onGestureEvent } = this;

    return (
      <TapGestureHandler maxDurationMs={100000} ref={this.tapGestureHandlerRef}>
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          <Animated.View
            onLayout={this.onLayout}
            style={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              backgroundColor: 'lightgrey',
              elevation: 10,
              transform: [{ translateY: this.transY }],
            }}
          >
            <Animated.Code>{this.runAnimationCode()}</Animated.Code>
            <PanGestureHandler
              ref={this.panGestureRefHeader}
              shouldCancelWhenOutside={false}
              onHandlerStateChange={onGestureEvent}
              {...{ onGestureEvent }}
            >
              <Animated.View>
                {/* <Header
                  snapPointBottom={this.snapPointBottom}
                  scrollY={this.props.scrollY}
                  translation={this.transY}
                  isPanGestureAnimationRunning={false}
                  isCardCollapsed={false}
                /> */}
              </Animated.View>
            </PanGestureHandler>
            <PanGestureHandler
              ref={this.panGestureRefContent}
              onHandlerStateChange={onGestureEvent}
              {...{ onGestureEvent }}
            >
              <Animated.View style={{ flex: 1 }}>
                <NativeViewGestureHandler ref={this.scrollViewRef}>
                  <Animated.ScrollView
                    onScroll={this.onScrollHandler}
                    scrollEventThrottle={16}
                    bounces={false}
                  >
                    <Card />
                  </Animated.ScrollView>
                </NativeViewGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </View>
      </TapGestureHandler>
    );
  }
}

export default BottomSheet;
