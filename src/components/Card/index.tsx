import React from 'react';
import styled from 'styled-components/native';
import Content from '../Content';

interface Props {
  cb: () => void;
}

const Card: React.FC<Props> = () => {
  return <Content />;
};

export default Card;
