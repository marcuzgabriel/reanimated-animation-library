import React from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import styled from 'styled-components/native';
import InputField from '../InputField';
import ScrollViewKeyboardAvoid from '../ScrollViewKeyboardAvoid';

const isIOS = Platform.OS === 'ios';

const Wrapper = Animated.createAnimatedComponent(styled.View``);

const ContentWrapper = styled.View<{ height: number }>`
  height: ${({ height }): number => height}px;
  width: 100%;
  border: 1px solid black;
`;

const PaddingWrapper = styled.View`
  padding: 16px;
`;

const ColumnWrapper = styled.View`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const FlexWrapper = styled.View`
  flex: 1;
`;

const Text = styled.Text``;

const inputStyle = {
  width: '100%',
  height: 50,
  textAlign: 'center',
  justifyContent: 'center',
  borderRadius: 6,
  borderWidth: 2,
  borderColor: 'black',
  backgroundColor: 'white',
};

const StaticPageHeight: React.FC = () => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const windowHeight = useWindowDimensions().height;

  return (
    <ContentWrapper height={windowHeight}>
      <ScrollViewKeyboardAvoid
        ref={scrollViewRef}
        bounces={false}
        keyboardAvoidBottomMargin={isIOS ? 64 : 100}
        scrollArrows={{
          isEnabled: false,
          dimensions: 40,
          fill: 'black',
          topArrowOffset: 40,
          bottomArrowOffset: 40,
        }}
        scrollEventThrottle={16}
      >
        <Wrapper>
          <ColumnWrapper>
            <FlexWrapper>
              <PaddingWrapper>
                <Text>
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum."
                </Text>
              </PaddingWrapper>
            </FlexWrapper>
            <PaddingWrapper>
              <InputField uniqueId="6" style={inputStyle} />
            </PaddingWrapper>
            <PaddingWrapper>
              <InputField uniqueId="12345" style={inputStyle} />
            </PaddingWrapper>
          </ColumnWrapper>
        </Wrapper>
      </ScrollViewKeyboardAvoid>
    </ContentWrapper>
  );
};

export default StaticPageHeight;
