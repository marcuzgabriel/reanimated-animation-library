import React, { createRef } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';
import Animated, { Value, Clock } from 'react-native-reanimated';
import {
  NativeViewGestureHandler,
  TapGestureHandler,
  PanGestureHandler,
  State as GestureState,
} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import Content from '../Content';
import Header from '../Header/OldSchool';
import { DEFAULT_SNAP_POINT_BOTTOM_RATIO } from '../../constants/animations';
import { CARD_BOTTOM_OFFSET } from '../../constants/styles';

interface BottomSheetState {
  scrollY?: Animated.SharedValue<number>;
  scrollYOldSchool?: Animated.Value<number>;
  isScrollable: boolean;
}

const {
  interpolateNode,
  and,
  sub,
  add,
  cond,
  eq,
  lessThan,
  event,
  call,
  spring,
  greaterThan,
  multiply,
  defined,
  set,
  or,
  not,
  block,
  clockRunning,
  lessOrEq,
  greaterOrEq,
  stopClock,
  startClock,
} = Animated;

const View = styled.View`
  z-index: 2;
`;

const OuterContentWrapper = styled.View`
  z-index: 2;
`;

const InnerContentWrapper = styled.View``;

export class BottomSheet extends React.Component<Record<string, any>, BottomSheetState> {
  private tapGestureHandlerRef = createRef<TapGestureHandler>();
  private panGestureRefHeader = createRef<PanGestureHandler>();
  private panGestureRefContent = createRef<PanGestureHandler>();
  private panGestureRefScroll = createRef<PanGestureHandler>();
  private scrollViewRef = createRef<Animated.ScrollView>();

  private gestureState: Value<number>;
  private translationY: Value<number>;
  private velocityY: Value<number>;
  private transY: Value<number>;
  private dragY: Value<number>;
  private dragVY: Value<number>;
  private prevDragY: Value<number>;
  private onGestureEvent: () => void;

  private gestureStateInner: Value<number>;
  private translationYInner: any;
  private velocityYInner: Value<number>;
  private transYInner: Value<number>;
  private transYInnerHelper: Value<number>;
  private dragYInner: Value<number>;
  private prevDragYInner: Value<number>;
  private dragVYInner: Value<number>;
  private onGestureEventInner: () => void;

  private cardHeight: Value<number>;
  private contentHeight: Value<number>;
  private isCardCollapsed: Value<number>;
  private isAnimationRunning: Value<number>;
  private isReadyForPanGesture: Value<number>;
  private isPanGestureScrollEnabled: Value<string | number | boolean>;
  private isPanGestureContentEnabled: Value<string | number | boolean>;
  private isScrolledToBottom: Value<number>;
  private isScrolledToTop: Value<number>;
  private innerScrollY: Value<number>;

  private animationClock: Clock;
  private springState: any;
  private springConfig: any;
  private windowHeight: number;

  constructor(props: Record<string, any>) {
    super(props);

    /* Handlers outer gestures */
    this.gestureState = new Value(0);
    this.translationY = new Value(0);
    this.velocityY = new Value(0);
    this.transY = new Value(0);
    this.dragY = new Value(0);
    this.dragVY = new Value(0);
    this.prevDragY = new Value(0);
    this.innerScrollY = new Value(0);

    /* Handles inner gestures */
    this.gestureStateInner = new Value(0);
    this.translationYInner = new Value(0);
    this.velocityYInner = new Value(0);
    this.transYInner = new Value(0);
    this.dragYInner = new Value(0);
    this.prevDragYInner = new Value(0);
    this.dragVYInner = new Value(0);
    this.transYInner = new Value(0);
    this.transYInnerHelper = new Value(0);

    this.cardHeight = new Value(0);
    this.contentHeight = new Value(0);
    this.isCardCollapsed = new Value(0);
    this.isAnimationRunning = new Value(0);
    this.isReadyForPanGesture = new Value(0);
    this.isPanGestureScrollEnabled = new Value(true);
    this.isPanGestureContentEnabled = new Value(false);
    this.isScrolledToBottom = new Value(0);
    this.isScrolledToTop = new Value(0);
    this.animationClock = new Clock();

    this.windowHeight = Dimensions.get('window').height;

    this.springConfig = {
      damping: 15,
      mass: 1,
      stiffness: 120,
      overshootClamping: false,
      restSpeedThreshold: 1,
      restDisplacementThreshold: 1,
      toValue: new Value(0),
    };

    this.springState = {
      finished: new Value(0),
      velocity: new Value(0),
      position: new Value(0),
      time: new Value(0),
    };

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

    this.onGestureEventInner = event(
      [
        {
          nativeEvent: {
            translationY: this.translationYInner,
            velocityY: this.velocityYInner,
            state: this.gestureStateInner,
          },
        },
      ],
      { useNativeDriver: true },
    );
  }

  onLayout = (e: LayoutChangeEvent): void => {
    this.cardHeight.setValue(e.nativeEvent.layout.height);
  };

  onHandlerStateChange = (): any => {
    this.translationYInner.extractOffset();
  };

  runAnimationCode = (): any =>
    block([
      cond(
        or(
          eq(this.gestureState, GestureState.UNDETERMINED),
          eq(this.gestureStateInner, GestureState.UNDETERMINED),
        ),
        [],
      ),
      cond(
        or(
          eq(this.gestureState, GestureState.BEGAN),
          eq(this.gestureStateInner, GestureState.BEGAN),
        ),
        [
          call([this.dragYInner, this.dragVYInner, this.transYInner, this.prevDragYInner], vals =>
            console.log('INNER GESTURE 0', vals),
          ),
        ],
      ),
      cond(
        or(
          eq(this.gestureState, GestureState.ACTIVE),
          eq(this.gestureStateInner, GestureState.ACTIVE),
        ),
        [
          cond(clockRunning(this.animationClock), stopClock(this.animationClock)),
          cond(not(clockRunning(this.animationClock)), [
            cond(
              eq(this.gestureState, GestureState.ACTIVE),
              [
                call([], () => console.log('OUTER GESTURE')),
                set(this.dragY, this.translationY),
                set(this.dragVY, this.velocityY),
                set(this.transY, add(this.transY, sub(this.dragY, this.prevDragY))),
                set(this.prevDragY, this.dragY),
              ],
              [
                call([this.translationYInner], vals => console.log('INNER GESTURE 1', vals)),

                set(this.dragYInner, this.translationYInner),
                set(this.dragVYInner, this.velocityYInner),
                set(
                  this.transYInnerHelper,
                  add(this.transYInnerHelper, sub(this.dragYInner, this.prevDragYInner)),
                ),
                set(this.prevDragYInner, this.dragYInner),

                set(this.isScrolledToTop, [cond(greaterThan(this.transYInnerHelper, 0), [1], [0])]),
                set(this.isScrolledToBottom, [
                  cond(
                    lessThan(
                      this.transYInnerHelper,
                      sub(this.windowHeight * 0.6, this.contentHeight),
                    ),
                    [1],
                    [0],
                  ),
                ]),

                cond(and(eq(this.isScrolledToTop, 0), eq(this.isScrolledToBottom, 0)), [
                  set(this.transYInner, this.transYInnerHelper),
                ]),
              ],
            ),
          ]),
        ],
      ),
      cond(
        or(eq(this.gestureState, GestureState.END), eq(this.gestureStateInner, GestureState.END)),
        [
          cond(eq(this.gestureState, GestureState.END), [
            set(this.prevDragY, 0),
            set(this.prevDragYInner, 0),
            set(
              this.transY,
              cond(defined(this.transY), [
                cond(not(clockRunning(this.animationClock)), [
                  set(this.springState.finished, 0),
                  set(this.springState.velocity, 0),
                  set(this.springState.position, this.transY),
                  set(
                    this.springConfig.toValue,
                    cond(
                      lessThan(this.prevDragY, this.dragY),
                      [multiply(this.cardHeight, DEFAULT_SNAP_POINT_BOTTOM_RATIO)],
                      [0],
                    ),
                  ),
                  set(this.isCardCollapsed, cond(lessThan(this.prevDragY, this.dragY), [1], [0])),
                  startClock(this.animationClock),
                ]),
                cond(clockRunning(this.animationClock), [
                  set(this.isAnimationRunning, 1),
                  spring(this.animationClock, this.springState, this.springConfig),
                  cond(eq(this.springState.finished, 1), [
                    stopClock(this.animationClock),
                    set(this.springState.finished, 0),
                    set(this.isAnimationRunning, 0),
                    set(this.gestureState, GestureState.UNDETERMINED),
                  ]),
                ]),
                this.springState.position,
              ]),
            ),
          ]),
        ],
      ),
    ]);

  render(): any {
    const { onGestureEvent } = this;

    const ScrollViewStyleInner = {
      maxHeight: this.windowHeight * 0.6,
      transform: [{ translateY: this.transYInner }],
    };

    return (
      <TapGestureHandler maxDurationMs={100000} ref={this.tapGestureHandlerRef}>
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          <Animated.View
            onLayout={this.onLayout}
            style={{
              position: 'absolute',
              overflow: 'hidden',
              zIndex: 2,
              width: '100%',
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              bottom: 0,
              backgroundColor: 'lightgrey',
              elevation: 10,
              transform: [{ translateY: this.transY }],
            }}
          >
            <OuterContentWrapper>
              <Animated.Code>{this.runAnimationCode()}</Animated.Code>
              <PanGestureHandler
                ref={this.panGestureRefHeader}
                shouldCancelWhenOutside={false}
                onHandlerStateChange={this.onGestureEvent}
                {...{ onGestureEvent }}
              >
                <Animated.View>
                  <Header
                    cardHeight={this.cardHeight}
                    scrollY={this.props.scrollY}
                    translationY={this.transY}
                    isAnimationRunning={this.isAnimationRunning}
                    isCardCollapsed={this.isCardCollapsed}
                  />
                </Animated.View>
              </PanGestureHandler>
            </OuterContentWrapper>
            <InnerContentWrapper>
              <PanGestureHandler
                ref={this.panGestureRefContent}
                onHandlerStateChange={this.onHandlerStateChange}
                onGestureEvent={this.onGestureEventInner}
              >
                <Animated.View style={ScrollViewStyleInner}>
                  <Content contentHeight={this.contentHeight} />
                </Animated.View>
              </PanGestureHandler>
            </InnerContentWrapper>
          </Animated.View>
        </View>
      </TapGestureHandler>
    );
  }
}

export default BottomSheet;
