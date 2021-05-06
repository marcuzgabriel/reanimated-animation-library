import React, { useContext } from 'react';
import { LayoutChangeEvent, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import { KeyboardContext } from '../../containers/KeyboardProviderWrapper';

interface Props {
  translationY?: Animated.SharedValue<number>;
  contentHeight?: Animated.Value<number>;
  keyboardOffset?: Animated.SharedValue<number>;
  scrollViewRef?: React.RefObject<Animated.ScrollView>;
  setKeyboardOffsetCallback?: (value: number) => void;
}

const Wrapper = styled.View``;

const Text = styled.Text``;

const WrapperOne = styled.View`
  width: 100%;
  padding: 32px 16px;
  align-items: center;
  height: 600px;
  background: rgba(0, 0, 0, 0.25);
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
  keyboardOffset,
  setKeyboardOffsetCallback,
}) => {
  const inputFieldsHeightPositions = useSharedValue<Record<string, any>>([]);
  const selectedInputFieldPositionY = useSharedValue(0);

  const keyboardContext = useContext(KeyboardContext);

  useAnimatedReaction(
    () => ({
      keyboardHeight: keyboardContext.keyboardHeight,
      selectedInputFieldPositionY,
    }),
    (
      result: Record<string, Animated.SharedValue<number>> | undefined,
      previous: Record<string, Animated.SharedValue<number>> | null | undefined,
    ) => {
      if (result && previous && keyboardContext.keyboardHeight.value > 0) {
        const res = selectedInputFieldPositionY.value - 32 - 50;

        if (setKeyboardOffsetCallback) {
          runOnJS(setKeyboardOffsetCallback)(res);
        }
      }
    },
    [keyboardContext.keyboardHeight, selectedInputFieldPositionY],
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
          keyboardType="numeric"
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
      </WrapperOne>
      <WrapperTwo />
    </Wrapper>
  );
};

export default Content;
