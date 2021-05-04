## reanimated-animation-library
This library provides some nice animation features with the latest reanimated 2.0+ update approach that is suitable for all platforms: Web, Android and iOS. The features are a BottomSheet component, an Appear animation component and a Slider component.

## Observations
Latest react-native-gesture-handler version vs old and latest react-native-reanimated vs old

| Package | Platform | Observation / bug |
| :--- | :---: | :---: |
| #react-native-reanimated | web | The package has a bug on web when it comes to interpolating SVG's. https://github.com/software-mansion/react-native-reanimated/issues/1951 |
| #react-native-gesture-handler | all | There are quite some limitation from previously. Before react-native-gesture-handler handled the touches automatically with no further control to it. Now all pan gestures needs to be controlled with waitFor and simoustanously.
| #react-native-gesture-handler | web & Android |  react-native-gesture-handler and the props waitFor and simoustanously don't work properly for either web or Android. The bad behaviour is testable when changing the enabled condition at bottomSheet/NewSchool.tsx file. Observe that the gesture event on iOS for the PanGesture and ScrollView gesture happens simoustanously and on Android and web it doesn't. https://github.com/software-mansion/react-native-gesture-handler/issues/420 https://github.com/software-mansion/react-native-gesture-handler/issues/927 |
| #useAnimatedGestureHandler | all | this approach is nice for simple use case but has no gesture state control. The same goes for useAnimatedScrollHander. Mixing, constraining and manipulating gestures directly is no longer achievably.
| #useAnimatedReaction | all | The oldschool approach with react-native-animated have a global scope for animations also known as the <Animation.Code> scope where values from different events can be mixed together and manipulated in direct time. It is rather difficult to achieve the same flexibility with the new hooks approach. Positively the new approach is probably more effective with the hooks and provides a smoother animation experience but there is UX limitations that is no longer achievable. useAnimatedReaction scope is the hook that comes the closest to <Animation.Code>
| #react-native-reanimated | all | scrollTo don't work |
