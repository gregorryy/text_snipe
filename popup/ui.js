import { PopupState } from "./state.js";
import { setupMessageHandlers } from "./messages.js";

export function initializeUI() {
  const elements = {
    captureBtn: document.getElementById("captureBtn"),
    copyBtn: document.getElementById("copyBtn"),
    extractedText: document.getElementById("extractedText"),
  };

  setupCaptureButton(elements);
  setupCopyButton(elements);
  setupMessageHandlers(elements);

  return elements;
}

function setupCaptureButton({ captureBtn, extractedText }) {
  captureBtn.addEventListener("click", async () => {
    if (PopupState.isCapturing) return;

    try {
      PopupState.setCapturing(true);
      captureBtn.disabled = true;
      captureBtn.textContent = "Sélection en cours...";

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) throw new Error("No active tab found");

      console.log("Active tab found:", tab);

      // Vérifiez que l'URL n'est pas une page chrome://
      if (tab.url.startsWith("chrome://")) {
        throw new Error("Cannot access a chrome:// URL");
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content-script.js"],
      });

      console.log("Script executed successfully");
    } catch (error) {
      console.error("Failed to initialize capture:", error);
    } finally {
      PopupState.setCapturing(false);
      captureBtn.disabled = false;
      captureBtn.textContent = "Capture";
    }
  });
}

function setupCopyButton({ copyBtn, extractedText }) {
  copyBtn.addEventListener("click", () => {
    extractedText.select();
    document.execCommand("copy");
  });
}

export function resetCaptureButton(captureBtn) {
  captureBtn.disabled = false;
  captureBtn.textContent = "Capture";
}
