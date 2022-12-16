chrome.contextMenus.create({
  id: "translate",
  title: "Translate Image",
  contexts: ["image"],
});

chrome.contextMenus.onClicked.addListener(function (clickData) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "start" });
  });
});
