export function setupUIHandlers({ captureBtn, copyBtn, extractedText }) {
  captureBtn.addEventListener("click", async () => {
    try {
      captureBtn.disabled = true;
      captureBtn.textContent = "Sélection en cours...";
      console.log("Button clicked");

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) {
        throw new Error("No active tab found");
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content-script.js"],
      });
    } catch (error) {
      console.error("Failed to initialize capture:", error);
      extractedText.value = "Une erreur est survenue lors de la capture.";
      captureBtn.disabled = false;
      captureBtn.textContent = "Sélectionner une zone";
    }
  });

  copyBtn.addEventListener("click", () => {
    extractedText.select();
    document.execCommand("copy");
    copyBtn.textContent = "Copié !";
    setTimeout(() => {
      copyBtn.textContent = "Copier";
    }, 2000);
  });
}
