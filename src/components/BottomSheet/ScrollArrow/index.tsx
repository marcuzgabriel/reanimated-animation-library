import React, { useContext } from 'react';
import { UserConfigurationContext } from 'containers/UserConfigurationProvider';
import ScrollArrowDefault from './ScrollArrowDefault';
interface Props {
  position: string;
}

const ScrollArrow: React.FC<Props> = ({ position }) => {
  const { scrollArrows } = useContext(UserConfigurationContext);

  switch (true) {
    case !scrollArrows:
      return null;
    case !!scrollArrows?.componentBottomArrow || !!scrollArrows?.componentTopArrow:
      return (
        <ScrollArrowDefault
          position={position}
          component={
            position === 'top'
              ? scrollArrows?.componentTopArrow
              : scrollArrows?.componentBottomArrow
          }
        />
      );
    default:
      return <ScrollArrowDefault position={position} />;
  }
};

export default ScrollArrow;
