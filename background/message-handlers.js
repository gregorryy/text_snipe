import { CaptureState } from "./capture-state.js";

export function setupMessageHandlers() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case "startCapture":
        handleStartCapture(request.tabId);
        break;

      case "captureVisibleTab":
        handleCaptureTab(sendResponse);
        return true; // Keep channel open for async response

      case "captureComplete":
        handleCaptureComplete(request);
        break;
    }
  });
}

function handleStartCapture(tabId) {
  CaptureState.startCapture(tabId);

  chrome.scripting.executeScript({
    target: { tabId },
    files: ["content-script.js"],
  });
}

function handleCaptureTab(sendResponse) {
  chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
    sendResponse(dataUrl);
  });
}

function handleCaptureComplete(request) {
  chrome.runtime.sendMessage(request);
  CaptureState.endCapture();
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "captureComplete") {
    console.log("Background received message:", message);
    // Traitez le message ici
  }
});
