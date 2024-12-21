// Content script
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    cursor: crosshair;
    z-index: 999999;
  `;
  const extractedText = "Texte extrait"; // Remplacez par le texte extrait réel
  chrome.runtime.sendMessage({
    action: "captureComplete",
    text: extractedText,
  });
  return overlay;
}

function createSelectionBox() {
  const selection = document.createElement("div");
  selection.style.cssText = `
    position: fixed;
    border: 2px solid #2563eb;
    background: rgba(37, 99, 235, 0.1);
    display: none;
    z-index: 999999;
  `;
  return selection;
}

function updateSelectionBox(selection, startX, startY, currentX, currentY) {
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);
  selection.style.width = width + "px";
  selection.style.height = height + "px";
  selection.style.left = (currentX > startX ? startX : currentX) + "px";
  selection.style.top = (currentY > startY ? startY : currentY) + "px";
}

async function handleScreenCapture(selection) {
  try {
    const rect = selection.getBoundingClientRect();
    const dataUrl = await captureArea(rect);
    const canvas = await processImage(dataUrl, rect);

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
        action: "captureArea",
        rect,
      },
      (response) => {
        if (response && response.dataUrl) {
          resolve(response.dataUrl);
        } else {
          reject(new Error("Failed to capture area"));
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

function initializeCapture() {
  let isSelecting = false;
  let startX, startY;

  const over = createOverlay();
  const selection = createSelectionBox();

  document.body.appendChild(over);
  document.body.appendChild(selection);

  over.addEventListener("mousedown", (e) => {
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    selection.style.display = "block";
    selection.style.left = startX + "px";
    selection.style.top = startY + "px";
  });

  over.addEventListener("mousemove", (e) => {
    if (!isSelecting) return;
    updateSelectionBox(selection, startX, startY, e.clientX, e.clientY);
  });

  over.addEventListener("mouseup", async () => {
    isSelecting = false;
    await handleScreenCapture(selection);
    over.remove();
    selection.remove();
  });
}

initializeCapture();
