import React from 'react';
import { Text } from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import type { EventHandlersProps } from '../worklets/__tests__/getGestures.test';

const PanGestureTestComponent: React.FC<EventHandlersProps & { gesture: any }> = ({
  eventHandlers,
  gesture,
}) => (
  <GestureHandlerRootView>
    <GestureDetector gesture={gesture}>
      <Text>RNGH v2.0 API test</Text>
    </GestureDetector>
  </GestureHandlerRootView>
);

export default PanGestureTestComponent;
