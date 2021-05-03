[react-native-reanimated] The package has a bug on web when it comes to interpolating SVG's.
- Issues:
https://github.com/software-mansion/react-native-reanimated/issues/1951

[react-native-gesture-handler] react-native-gesture-handler onEnd state doesn't recognize translation.y.value you have
to use the extracted values.

[react-native-gesture-handler] react-native-gesture-handler and the props waitFor and simoustanously don't work
properly for either web or Android. The bad behaviour is testable when changing the enabled condition
at bottomSheet/NewSchool.tsx file. Observe that the on iOS the pan gesture and the scroll event occours simoustanously
and on android it doesn't.

- Issues:
https://github.com/software-mansion/react-native-gesture-handler/issues/420
https://github.com/software-mansion/react-native-gesture-handler/issues/927

[useAnimatedGestureHandler] this approach is nice for simple use case but has no gesture state control.
The same goes for useAnimatedScrollHander. Mixing touches like a scrolling event with a gesture handler is
only achievably on iOS. It is very strict when it comes to touches and will not work properly etc.

[allplatforms] The oldschool approach with react-native-animated have a global scope for animations
also known as the <Animation.Code> scope where values from different events can be mixed together
and manipulated in direct time. It is rather difficult to achieve the same flexibility with the
new hooks approach. Positively it probably more effective with the hooks and provides a smoother animation
experience but there is UX limitations that is no longer achievable. useAnimatedReaction scope is the
hook that comes the closest to <Animation.Code>