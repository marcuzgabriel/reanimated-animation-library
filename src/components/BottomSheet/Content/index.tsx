import React, { useContext } from 'react';
import {
  useWindowDimensions,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import Animated, { scrollTo, useSharedValue, useAnimatedReaction } from 'react-native-reanimated';
import styled from 'styled-components/native';
import { KeyboardContext } from 'containers/KeyboardProvider';
import { onIsInputFieldFocused } from 'worklets';

interface Props {
  translationY: Animated.SharedValue<number>;
  contentHeight?: Animated.Value<number>;
  keyboardOffset?: Animated.SharedValue<number>;
  maxHeight: Animated.SharedValue<number>;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  isInputFieldFocused: Animated.SharedValue<boolean>;
  setKeyboardOffsetCallback?: (value: number) => void;
}

const Wrapper = styled.View``;

const Text = styled.Text``;

const WrapperOne = styled.View`
  width: 100%;
  padding: 32px;
  align-items: center;
`;

const WrapperTwo = styled.View`
  height: 100px;
  width: 100%;
  background: black;
`;

const TextInput = styled.TextInput`
  margin: 16px;
  width: 100%;
  height: 50px;
  text-align: center;
  border-radius: 6px;
  background-color: white;
`;

const Content: React.FC<Props> = ({
  contentHeight,
  translationY,
  scrollViewRef,
  maxHeight,
  isInputFieldFocused,
}) => {
  const inputFieldsHeightPositions = useSharedValue<Record<string, any>>([]);
  const selectedInputFieldPositionY = useSharedValue(0);

  const keyboardContext = useContext(KeyboardContext);
  const windowHeight = useWindowDimensions().height;

  useAnimatedReaction(
    () => ({
      isKeyboardVisible: keyboardContext.isKeyboardVisible,
      keyboardHeight: keyboardContext.keyboardHeight,
      selectedInputFieldPositionY,
    }),
    (
      result: Record<string, Animated.SharedValue<number>>,
      previous: Record<string, Animated.SharedValue<number>> | null | undefined,
    ) =>
      onIsInputFieldFocused({
        result,
        previous,
        maxHeight,
        windowHeight,
        scrollViewRef,
        translationY,
        isInputFieldFocused,
      }),
    [keyboardContext.isKeyboardVisible, selectedInputFieldPositionY],
  );

  const onLayout = (e: LayoutChangeEvent): void => {
    contentHeight?.setValue(e.nativeEvent.layout.height);
  };

  const onInputLayout = (e: LayoutChangeEvent, index: number): void => {
    inputFieldsHeightPositions.value.push({ index, y: e.nativeEvent.layout.y });
  };

  const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>, index: number): void => {
    selectedInputFieldPositionY.value = inputFieldsHeightPositions.value.find(
      ({ index: i }: any) => i === index,
    ).y;
  };

  return (
    <Wrapper onLayout={onLayout}>
      <WrapperOne>
        <Text>Ipsem lorem whatever magic harry potter stuff</Text>
        <TextInput
          onLayout={(e): void => onInputLayout(e, 0)}
          onFocus={(e): void => onFocus(e, 0)}
          placeholder="useless placeholder"
          keyboardType="default"
        />
        <TextInput
          onLayout={(e): void => onInputLayout(e, 1)}
          onFocus={(e): void => onFocus(e, 1)}
          placeholder="useless placeholder"
          keyboardType="numeric"
        />
        <TextInput
          onLayout={(e): void => onInputLayout(e, 2)}
          onFocus={(e): void => onFocus(e, 2)}
          placeholder="useless placeholder"
          keyboardType="numeric"
        />
        <Text>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum."
        </Text>
        <TextInput
          onLayout={(e): void => onInputLayout(e, 3)}
          onFocus={(e): void => onFocus(e, 3)}
          placeholder="useless placeholder"
          keyboardType="numeric"
        />
        <Text>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum."
        </Text>
        <TextInput
          onLayout={(e): void => onInputLayout(e, 4)}
          onFocus={(e): void => onFocus(e, 4)}
          placeholder="useless placeholder"
          keyboardType="numeric"
        />
      </WrapperOne>
      {/* <WrapperTwo /> */}
    </Wrapper>
  );
};

export default Content;
