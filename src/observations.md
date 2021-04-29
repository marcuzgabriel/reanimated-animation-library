[web] The package has a bug on web when it comes to interpolating SVG's.
https://github.com/software-mansion/react-native-reanimated/issues/1951

[web] waitFor property is not performant on web on hard refresh.
If browser is hard refreshed and you are in a mobile format then an error will be
logged to the Javascript console with information about a ref that no longer can be found.
This causes the waitFor to work inefficiently resulting in the card acting wierdly.
It can be fixed either by resizing the web browser to desktop and then back to
mobile or opening a new tab.

[web] Having the BottomSheet as a fixed incentiative on a ScrollView is wrong. The
ScrollView will take over the entire view port. If the BottomSheet has an innerscrolling event
then it will act inefficiently and cause wrong behaviour. The BottomSheet always have to be
located outside and other component as a build-on-top approach. 

[web] react-native-gesture-handler onEnd state doesn't recognize translation.y.value. I have had to use the original props ctx.startY +
event.translationY instead of just translation.y.value which is identical. For some reason it does not read the translation.y.value properly on web.

[web] react-native-gesture-handler and the props waitFor and simoustanously use other refs don't work. I have tried
the same approach as bottom-sheet-template from the react-native-animation library.

[allplatforms] The oldschool approach with react-native-animated have a global scope for animations
also known as the <Animation.Code> scope. It is rather difficult to achieve the same flexibility with the
hooks only. There is a useAnimatedReaction scope that is sort of simular