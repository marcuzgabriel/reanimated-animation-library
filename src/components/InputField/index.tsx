import React, { useContext } from 'react';
import { TextInputProps, LayoutChangeEvent } from 'react-native';
import styled from 'styled-components/native';
import { KeyboardAvoidingViewContext } from '../../containers/KeyboardAvoidingViewProvider';
import type { InputFieldProps } from '../../types';

interface Props extends TextInputProps {
  uniqueId: number | string;
  style: any;
}

const TextInput = styled.TextInput``;

const InputField: React.FC<Props> = props => {
  const { inputFields, selectedInputFieldPositionY } = useContext(KeyboardAvoidingViewContext);

  const onLayout = (e: LayoutChangeEvent): void => {
    const doesExist = inputFields.value.some(
      ({ identifier }: Pick<InputFieldProps, 'identifier'>) => identifier === props.uniqueId,
    );

    if (!doesExist) {
      inputFields.value.push({
        identifier: props.uniqueId,
        y: e.nativeEvent.layout.y,
      });
    } else if (inputFields.value.length > 0) {
      const hasSameIdentifier = inputFields.value.some(
        ({ identifier, y }: InputFieldProps) =>
          identifier === props.uniqueId && e.nativeEvent.layout.y !== y,
      );

      if (hasSameIdentifier) {
        console.warn(`uniqueId: ${props.uniqueId} already exists. Please change it`);
      }
    }
  };

  const onFocus = (): void => {
    try {
      selectedInputFieldPositionY.value =
        inputFields.value.find(({ identifier }) => identifier === props.uniqueId)?.y ?? 0;
    } catch (err) {
      console.warn(
        'Please provide a uniqueId prop to the input field so the animation know what to look for',
      );
    }
  };

  return <TextInput onLayout={onLayout} onFocus={onFocus} {...props} />;
};

export default InputField;
