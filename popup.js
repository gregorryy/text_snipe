import { initializeUI } from "./popup/ui.js";
import { setupMessageHandlers } from "./popup/messages.js";

document.addEventListener("DOMContentLoaded", () => {
  const elements = initializeUI();
  setupMessageHandlers(elements);
});
