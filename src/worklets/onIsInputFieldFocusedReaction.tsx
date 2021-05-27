import Animated from 'react-native-reanimated';
import { resourceLimits } from 'worker_threads';

interface Props {
  windowHeight: number;
  contentHeight: Animated.SharedValue<number>;
}

export const onIsInputFieldFocusedReaction = ({ windowHeight, contentHeight }: Props): void => {
  'worklet';

  const isScrollable = contentHeight.value > windowHeight;

  console.log(contentHeight.value, windowHeight);

  // if (derivedContentHeight?.value && e > 0) {
  //   console.log('i am working...', windowHeight, derivedContentHeight.value);
  // }
};
