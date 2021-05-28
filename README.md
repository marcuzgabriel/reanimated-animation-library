# [WIP] Reanimated-animation-library
This library provides some nice animation features with the latest reanimated 2+ (hooks) update approach that is suitable for all platforms: Web, Android and iOS. The features are a BottomSheet, an Appear animation, a Slider and a Morphing SVG Graph component.

## Current progress
- [ ] ScrollViewKeyboardAvoid. Personally I have had a hard time using the KeyboardAvoidView from react-native or other libraries. This approach manipulates translationY position with reanimated. This ensures a very, consistent and reusable approach for all platforms
  - [ ] A height needs to be set when it is not scrollable
  - [ ] Code example / integration description  
- [ ] BottomSheet
  - [ ] Aggressively scroll to top handler
  - [x] Scroll arrows that appear / dissapear
  - [x] Fading scroll edges for alle platforms 
  - [x] Drag resistance when using the snap effect
  - [x] InputField component that accepts a unique id so no matter where the component is located then a nice scrollTo animation effect to the input field is achieved
  - [x] If the background content is not scrollable but there is content hiding behind the card, then make the component snappable so the card will collapse if the user tries to do a scroll gesture on the background content
  - [x] Morphing arrow that follows the Y axis animation of the card
  - [x] Card is collapsable by either clicking, gesturing, overlapping from scroll to pan gesture or scrolling the background content
  - [x] The card should be able to handle input fields. When an input field is pressed, then the keyboard should press the card upwards and a scrolling animation should scroll to the input field
  - [x] Add a ScrollView component in a PanGestureHandler component
  - [x] iOS + Android: Overlap from a scrolling gesture to a pan gesture by creating a scroll-to-top snapping effect
  - [x] Basic animation features (scrolling and pan gesture event)
  - [x] Header component
  - [x] Content component
  - [x] Footer component
- [ ] Appear
- [ ] Slider
- [ ] Morphing SVG Graph
- [ ] Unit tests

## Expo integration
npm install @marcuzgabriel/reanimated-animation-library@1.0.0
https://github.com/marcuzgabriel/reanimated-animation-library/packages/813007

Update app.json accordingly
```Javascript
{
  "name": "MyTSProject",
  "displayName": "MyTSProject",
  "expo": {
    "name": "MyTSProject",
    "slug": "MyTSProject",
    "version": "1.0.0",
    "assetBundlePatterns": [
      "**/*"
    ],
    "web": {
      "build": {
        "babel": {
          "include": [
            "@marcuzgabriel/reanimated-animation-library"
          ]
        }
      }
    }
  }
}
```

## Observations
Latest react-native-gesture-handler version vs old and latest react-native-reanimated vs old

| Package | Platform | Observations / bugs |
| :--- | :---: | :---: |
| #react-native-reanimated | web | The package has a bug on web when it comes to interpolating SVG's. https://github.com/software-mansion/react-native-reanimated/issues/1951 |
| #react-native-gesture-handler | all | There are quite some limitation from previously. Before react-native-gesture-handler handled the touches automatically with no further control to it. Now all pan gestures needs to be controlled with waitFor and simoustanously.
| #react-native-gesture-handler | web & Android |  react-native-gesture-handler and the props waitFor and simultaneously don't work properly for either web or Android. The behaviourial indefferences can be observed when you play around with simultaneously handlers. On iOS simultaneously handlers follow along (works as expected) where on Android and web they don't. Please ask if you need an example. https://github.com/software-mansion/react-native-gesture-handler/issues/420 https://github.com/software-mansion/react-native-gesture-handler/issues/927 |
| #useAnimatedGestureHandler | all | this approach is nice for simple use case but has no gesture state control. The same goes for useAnimatedScrollHander. Mixing, constraining and manipulating gestures directly is no longer achievably.
| #useAnimatedReaction | all | The oldschool approach with react-native-animated have a global scope for animations also known as the <Animation.Code> scope where values from different events can be mixed together and manipulated in direct time. It is rather difficult to achieve the same flexibility with the new hooks approach. Positively the new approach is probably more effective with the hooks and provides a smoother animation experience. useAnimatedReaction scope is the hook that comes the closest to <Animation.Code>
| #react-native-reanimated | all | A much better control of animations is now achieveable with HOA's (higher-order animations) as the animations functions as a first-class citizen. A few examples can be found in the library under ./src/hoas |
| #useWindowDimensions | Android | A micro difference occours when setting the child height within a Animated.ScrollView component to the window height with the use of useWindowDimensions. When exctracting the child height with (onContentSizeChange) then the height says 683.4285888671875 vs the windowheight 683.4285714285714. An offset constant is therefore needed to determine scrollability.

