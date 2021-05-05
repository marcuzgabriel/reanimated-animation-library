# Reanimated-animation-library
This library provides some nice animation features with the latest reanimated 2+ (hooks) update approach that is suitable for all platforms: Web, Android and iOS. The features are a BottomSheet, an Appear animation, a Slider and a Morphing SVG Graph component.

## Current progress
- [ ] BottomSheet
  - [ ] Aggressively scroll to top handler
  - [x] If the background content is not scrollable but there is content hiding behind the card, then make the component snappable so the card will collapse if the user tries to do a scroll gesture on the background content
  - [ ] Implement prop flexibility and update the readme file on how to implement the BottomSheet
  - [x] Morphing arrow that follows the Y axis animation of the card
  - [x] Card is collapsable by either clicking, gesturing, overlapping from scroll to pan gesture or scrolling the background content
  - [ ] The card should be able to handle input fields. When an input field is pressed, then the keyboard should press the card upwards
  - [x] Add a ScrollView component in a PanGestureHandler component
  - [x] iOS + Android: Overlap from a scrolling gesture to a pan gesture by creating a scroll-to-top snapping effect
  - [x] Basic animation features (scrolling and pan gesture event)
- [ ] Appear
- [ ] Slider
- [ ] Morphing SVG Graph

## Observations
Latest react-native-gesture-handler version vs old and latest react-native-reanimated vs old

| Package | Platform | Observation / bug |
| :--- | :---: | :---: |
| #react-native-reanimated | web | The package has a bug on web when it comes to interpolating SVG's. https://github.com/software-mansion/react-native-reanimated/issues/1951 |
| #react-native-gesture-handler | all | There are quite some limitation from previously. Before react-native-gesture-handler handled the touches automatically with no further control to it. Now all pan gestures needs to be controlled with waitFor and simoustanously.
| #react-native-gesture-handler | web & Android |  react-native-gesture-handler and the props waitFor and simoustanously don't work properly for either web or Android. The bad behaviour is testable when changing the enabled condition at bottomSheet/NewSchool.tsx file. Observe that the gesture event on iOS for the PanGesture and ScrollView gesture happens simoustanously and on Android and web it doesn't. https://github.com/software-mansion/react-native-gesture-handler/issues/420 https://github.com/software-mansion/react-native-gesture-handler/issues/927 |
| #useAnimatedGestureHandler | all | this approach is nice for simple use case but has no gesture state control. The same goes for useAnimatedScrollHander. Mixing, constraining and manipulating gestures directly is no longer achievably.
| #useAnimatedReaction | all | The oldschool approach with react-native-animated have a global scope for animations also known as the <Animation.Code> scope where values from different events can be mixed together and manipulated in direct time. It is rather difficult to achieve the same flexibility with the new hooks approach. Positively the new approach is probably more effective with the hooks and provides a smoother animation experience but there is UX limitations that is no longer achievable. useAnimatedReaction scope is the hook that comes the closest to <Animation.Code>
| #react-native-reanimated | all | scrollTo don't work. The old approach ref.current.getNode().scrollTo() has to be used instead |
| #react-native-reanimated | all | A much better control of animations is now achieveable with HOA's (higher-order animations) as the animations functions as a first-class citizen. A few examples can be found in the library under ./src/hoas 
