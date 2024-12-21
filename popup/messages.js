import { resetCaptureButton } from "./ui.js";

export function setupMessageHandlers(elements) {
  const { captureBtn, copyBtn, extractedText } = elements;

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "captureComplete") {
      console.log("Message received:", request); // Ajoutez ce log pour vérifier la réception du message
      extractedText.value = request.text || "Aucun texte détecté";
      copyBtn.disabled = !request.text;
      resetCaptureButton(captureBtn);
    }
  });
}
