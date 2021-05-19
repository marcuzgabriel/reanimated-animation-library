import React, { useContext } from 'react';
import { TextInputProps, LayoutChangeEvent, TextStyle } from 'react-native';
import styled from 'styled-components/native';
import { FocusedInputFieldContext } from 'containers/FocusedInputFieldProvider';

/* NOTE: There is a type bug when it comes to justifyContent and
textAlign parsed directly from an object in react-native. */
type StyleTypeFix<T> = {
  [K in keyof T]: K extends 'justifyContent' ? any : K extends 'textAlign' ? any : T[K];
};

interface Props extends TextInputProps {
  uniqueId: number | string;
  style: StyleTypeFix<TextStyle>;
}

interface DoesExist {
  identifier: number | undefined;
}

const TextInput = styled.TextInput``;

const InputField: React.FC<Props> = props => {
  const { inputFields, selectedInputFieldPositionY } = useContext(FocusedInputFieldContext);

  const onLayout = (e: LayoutChangeEvent): void => {
    const doesExist = inputFields.value.some(
      ({ identifier }: DoesExist) => identifier === props.uniqueId,
    );

    if (!doesExist) {
      inputFields.value.push({
        identifier: props.uniqueId,
        y: e.nativeEvent.layout.y,
      });
    } else if (inputFields.length > 0) {
      const hasSameIdentifier = inputFields.value.some(
        ({ identifier, y }: Record<string, number | string>) =>
          identifier === props.uniqueId && e.nativeEvent.layout.y !== y,
      );

      if (hasSameIdentifier) {
        throw new Error(`uniqueId: ${props.uniqueId} already exists. Please change it`);
      }
    }
  };

  const onFocus = (): void => {
    try {
      selectedInputFieldPositionY.value = inputFields.value.find(
        ({ identifier }: Record<string, number | string>) => identifier === props.uniqueId,
      ).y;
    } catch (err) {
      throw new Error(
        'Please provide a uniqueId prop to the input field so the animation know what to look for',
      );
    }
  };

  return <TextInput onLayout={onLayout} onFocus={onFocus} {...props} />;
};

export default InputField;
