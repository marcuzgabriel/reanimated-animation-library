import React, { useContext } from 'react';
import ScrollArrowDefault from './ScrollArrowDefault';
import { UserConfigurationContext } from '../../../containers/UserConfigurationProvider';
interface Props {
  position: string;
}

const ScrollArrow: React.FC<Props> = ({ position }) => {
  const { scrollArrows, scrollArrowTopComponent, scrollArrowBottomComponent } =
    useContext(UserConfigurationContext);

  if (!!scrollArrowTopComponent || scrollArrowBottomComponent) {
    return (
      <ScrollArrowDefault
        position={position}
        component={position === 'top' ? scrollArrowTopComponent : scrollArrowBottomComponent}
      />
    );
  }

  return <ScrollArrowDefault position={position} />;
};

export default ScrollArrow;
