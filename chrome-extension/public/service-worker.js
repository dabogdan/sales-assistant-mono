/*global chrome */

// on icon click, open the side panel (showing index.html)
// NOTE: this requires "sidePanel" permission in manifest.json
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.setOptions({
      tabId: tab.id,
      path: "index.html",
      enabled: true,
    });
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (e) {
    console.warn("Failed to open side panel:", e);
  }

  setTimeout(() => {
    chrome.runtime.sendMessage({
      target: "APP",
      currentTabId: tab.id,
    });
  }, 300);
});

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target !== "SERVICE_WORKER") return;

  const existingContexts = await chrome.runtime.getContexts({});
  const offscreenDocument = existingContexts.find(
    (c) => c.contextType === "OFFSCREEN_DOCUMENT"
  );

  // If an offscreen document is not already open, create one.
  if (!offscreenDocument) {
    // Create an offscreen document.
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["USER_MEDIA"],
      justification: "Recording from chrome.tabCapture API",
    });
  }

  // Send the stream ID to the offscreen document to start recording.
  await chrome.runtime.sendMessage({
    action: message.action,
    streamId: message.streamId,
    target: "OFFSCREEN",
  });
});
