import React, { useContext } from 'react';
import { TextInputProps, LayoutChangeEvent, TextStyle } from 'react-native';
import styled from 'styled-components/native';
import { FocusedInputFieldContext } from 'containers/FocusedInputFieldProvider';

/* NOTE: There is a type bug when it comes to justifyContent and
textAlign parsed directly from an object. */
type StylesTypeFix<T> = {
  [K in keyof T]: K extends 'justifyContent' ? any : K extends 'textAlign' ? any : T[K];
};

interface Props extends TextInputProps {
  uniqueId: number | string;
  style: StylesTypeFix<TextStyle>;
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
    }

    try {
      if (doesExist || typeof props.uniqueId === 'undefined') {
        const msg = doesExist
          ? `uniqueId: ${props.uniqueId} is already taken. Please pick another`
          : 'Input field does not have a uniqueId prop.';

        throw msg;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const onFocus = (): void => {
    selectedInputFieldPositionY.value = inputFields.value.find(
      ({ identifier }: any) => identifier === props.uniqueId,
    ).y;
  };

  return <TextInput onLayout={onLayout} onFocus={onFocus} {...props} />;
};

export default InputField;
