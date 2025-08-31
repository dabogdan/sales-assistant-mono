/*global chrome */

// on icon click, open a window
chrome.action.onClicked.addListener(async (tab) => {
  chrome.sidePanel.setOptions({
    path: "index.html",
    tabId: tab.id,
    enabled: true,
  });
  // chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  chrome.sidePanel.open({ tabId: tab.id });
});

// chrome.runtime.onConnect.addListener(function (port) {
//   if (port.name !== "sidePanelToggle") return;

//   port.onDisconnect.addListener(async () => {
//     const result = await chrome.storage.local.get(["isSidePanelOpen"]);
//     const isSidePanelOpen = result["isSidePanelOpen"];
//     await chrome.storage.local.set({ ["isSidePanelOpen"]: !isSidePanelOpen });
//   });
// });

// let streamId = null;

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

  // if (!streamId) {
  //   streamId = await chrome.tabCapture.getMediaStreamId({
  //     targetTabId: message.currentTabId,
  //   });
  // }

  // Send the stream ID to the offscreen document to start recording.
  await chrome.runtime.sendMessage({
    action: message.action,
    streamId: message.streamId,
    keywords_map: message.keywords_map,
    domain_response_map: message.domain_response_map,
    business_name: message.business_name,
    target: "OFFSCREEN",
  });

  // chrome.action.setIcon({ path: "/icons/recording.png" });
});
