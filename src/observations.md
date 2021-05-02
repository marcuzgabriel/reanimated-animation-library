[web] The package has a bug on web when it comes to interpolating SVG's.
https://github.com/software-mansion/react-native-reanimated/issues/1951

[react-native-gesture-handler] react-native-gesture-handler onEnd state doesn't recognize translation.y.value.

[react-native-gesture-handler] react-native-gesture-handler and the props waitFor and simoustanously use other refs don't work. This also means that it is not possible to have an inner scrolling event that within a pan gesture and expect both to work properly.

[useAnimatedGestureHandler] this approach is nice for simple use case but has no gesture state control.
Mixing touches like a scrolling event with a gesture handler is no longer achievable with this hook.
It is very strict when it comes to touches and will not work properly etc. if you have a pan gesture
with a scrolling event and you want the pan gesture to activate when scrollY is at 0, then this wont 
work.

[allplatforms] The oldschool approach with react-native-animated have a global scope for animations
also known as the <Animation.Code> scope. It is rather difficult to achieve the same flexibility with the
hooks only. There is a useAnimatedReaction scope that is sort of simular but does not achieve the same
flexibility.