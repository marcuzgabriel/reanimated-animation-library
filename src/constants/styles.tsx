export const DEFAULT_CARD_HEIGHT = 500;
export const CARD_BOTTOM_OFFSET = 50;
export const CARD_TOP_DRAG_OFFSET = 25;
export const CLOSE_CARD_BUTTON_HEIGHT = 50;
export const CLOSE_CARD_TOP_POSITION = 25;
export const CLOSE_OPEN_CARD_BUTTON_HITSLOP = 16;
export const TOUCHABLE_WITHOUT_FEEDBACK_OFFSET = 1;
export const CARD_STYLE_IOS = {
  position: 'absolute',
  zIndex: 2,
  width: '100%',
  bottom: -CARD_BOTTOM_OFFSET,
  borderTopRightRadius: 16,
  borderTopLeftRadius: 16,
  backgroundColor: 'lightgrey',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
};
export const CARD_STYLE_ANDROID_AND_WEB = {
  position: 'absolute',
  zIndex: 2,
  width: '100%',
  bottom: 0,
  borderTopRightRadius: 16,
  borderTopLeftRadius: 16,
  backgroundColor: 'lightgrey',
  elevation: 10,
};

export const HIT_SLOP = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20,
};
