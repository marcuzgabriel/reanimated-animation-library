import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';

const TouchableOpacity = styled.TouchableOpacity<{ topOffset?: number; rightOffset?: number }>`
  position: absolute;
  top: ${({ topOffset }): number => topOffset ?? 0}px;
  right: ${({ rightOffset }): number => rightOffset ?? 0}px;
  height: 100%;
  width: 100%;
`;

interface CloseIconProps {
  onPress: () => void;
}

const CloseIcon: React.FC<CloseIconProps> = ({ onPress }) => {
  const { contentHeightWhenKeyboardIsVisible } = useContext(UserConfigurationContext);
  const { icon, topOffset, rightOffset } = contentHeightWhenKeyboardIsVisible?.closeIcon ?? {};

  return (
    <TouchableOpacity onPress={onPress} topOffset={topOffset} rightOffset={rightOffset}>
      {typeof icon === 'function' ? icon() : null}
    </TouchableOpacity>
  );
};

export default CloseIcon;
