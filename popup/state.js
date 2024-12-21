// Popup state management
export const PopupState = {
  isCapturing: false,

  setCapturing(value) {
    this.isCapturing = value;
  },

  resetState() {
    this.isCapturing = false;
  },
};
