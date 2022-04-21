import React from 'react';
import styled from 'styled-components/native';
import {
  PanGesture,
  TapGesture,
  NativeGesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const Text = styled.Text``;

const PanGestureTestComponent: React.FC<{
  gesture: PanGesture | TapGesture | NativeGesture;
}> = ({ gesture }) => (
  <GestureHandlerRootView>
    <GestureDetector gesture={gesture}>
      <Text>RNGH v2.0 API test</Text>
    </GestureDetector>
  </GestureHandlerRootView>
);

export default PanGestureTestComponent;
