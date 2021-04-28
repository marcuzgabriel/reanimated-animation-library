# react-native-reanimated
[web] The package has a bug on web when it comes to interpolating SVG's.
https://github.com/software-mansion/react-native-reanimated/issues/1951

# react-native-gesture-handler
[web] waitFor property is not performant on web on hard refresh.
If browser is hard refreshed and you are in a mobile format then an error will be
logged to the Javascript console with information about a ref that no longer can be found.
This causes the waitFor to work inefficiently resulting in the card acting wierdly.
It can be fixed either by resizing the web browser to desktop and then back to
mobile or opening a new tab.