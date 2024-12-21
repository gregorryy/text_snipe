export const CaptureState = {
  isCapturing: false,
  activeTabId: null,

  startCapture(tabId) {
    this.isCapturing = true;
    this.activeTabId = tabId;
  },

  endCapture() {
    this.isCapturing = false;
    this.activeTabId = null;
  },
};
