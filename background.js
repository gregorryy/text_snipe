import { setupMessageHandlers } from "./background/message-handlers.js";

setupMessageHandlers();

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "captureComplete") {
    console.log("Background received message:", message);
    // Traitez le message ici
  }
});
