export async function handleScreenCapture(selection) {
  try {
    const rect = selection.getBoundingClientRect();
    const dataUrl = await captureArea(rect);
    const canvas = await processImage(dataUrl, rect);

    // Send the processed image back to the extension
    chrome.runtime.sendMessage({
      action: "captureComplete",
      text: "Texte exemple capturé", // Replace with actual OCR result
    });
  } catch (error) {
    console.error("Error capturing screen:", error);
    chrome.runtime.sendMessage({
      action: "captureComplete",
      text: "Erreur lors de la capture",
    });
  }
}

async function captureArea(rect) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action: "captureVisibleTab",
        area: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      }
    );
  });
}

async function processImage(dataUrl, rect) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      canvas.width = rect.width;
      canvas.height = rect.height;
      context.drawImage(
        image,
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        0,
        0,
        rect.width,
        rect.height
      );
      resolve(canvas);
    };

    image.src = dataUrl;
  });
}
