import React from 'react';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  height: 100px;
  width: 100%;
  background: black;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  color: white;
`;

const Footer: React.FC = () => (
  <Wrapper>
    <Text>Footer</Text>
  </Wrapper>
);

export default Footer;
