import React from 'react';
import styled from 'styled-components/native';
import InputField from '../../InputField';

const BottomSheetContentWrapper = styled.View`
  padding: 0px 16px 16px 16px;
`;

const TouchableOpacity = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background: black;
`;

const inputStyle = {
  width: '100%',
  height: 50,
  textAlign: 'center',
  justifyContent: 'center',
  borderRadius: 6,
  backgroundColor: 'white',
};

const Text = styled.Text``;

const Content: React.FC = () => (
  <BottomSheetContentWrapper>
    <TouchableOpacity />
    <Text>
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    </Text>
    <InputField
      uniqueId={0}
      placeholder="useless placeholder"
      keyboardType="numeric"
      style={inputStyle}
    />
    <InputField
      uniqueId={1}
      placeholder="useless placeholder"
      keyboardType="default"
      style={inputStyle}
    />
    <Text>
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    </Text>
    <InputField uniqueId="1234" placeholder="useless placeholder" style={inputStyle} />
    <InputField uniqueId="123456" placeholder="useless placeholder" style={inputStyle} />
    <Text>
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    </Text>
    <InputField uniqueId="1234567" placeholder="useless placeholder" style={inputStyle} />
  </BottomSheetContentWrapper>
);

export default Content;
