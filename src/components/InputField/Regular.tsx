import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import styled from 'styled-components/native';

interface InputFieldProps {
  placeholder: string;
}

const AVAILABLE_SPACE_DESKTOP = 68;
const AVAILABLE_SPACE_MOBILE = 38;

const TextInput = styled.TextInput``;

const Regular: React.FC<InputFieldProps> = ({ placeholder }) => {
  const TEXT_INPUT_STYLE = {
    padding: 6,
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    outline: 'none',
    borderWidth: 3,
    borderColor: 'grey',
    borderRadius: 7,
    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.85)',
  };

  return (
    <TextInput
      style={TEXT_INPUT_STYLE as any}
      placeholder={placeholder}
      placeholderTextColor="grey"
      keyboardType="default"
    />
  );
};

export default Regular;
