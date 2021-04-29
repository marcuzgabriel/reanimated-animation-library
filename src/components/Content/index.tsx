import React from 'react';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  width: 100%;
  height: 600px;
  background: yellow;
`;

const BottomWrapper = styled.View`
  height: 100px;
  width: 100%;
  background: black;
`;

const Content: React.FC = () => {
  return (
    <>
      <Wrapper />
      <BottomWrapper />
    </>
  );
};

export default Content;
