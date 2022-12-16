async function popup() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "start" });
  });
}

chrome.storage.sync.get("language", function (data) {
  if (data.language === undefined) {
    chrome.storage.sync.set({ language: "en" });
    document.getElementById("language-select").value = "en";
  } else {
    let select = document.getElementById("language-select");
    select.value = data.language;
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === data.language) {
        select.options[i].selected = true;
        break;
      }
    }
  }
});

chrome.storage.sync.get("textDirection", function (data) {
  if (data.textDirection === undefined) {
    chrome.storage.sync.set({ textDirection: "LR" });
    document.getElementById("text-direction").value = "LR";
  } else {
    let select = document.getElementById("text-direction");
    select.value = data.textDirection;
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === data.textDirection) {
        select.options[i].selected = true;
        break;
      }
    }
  }
});

chrome.storage.sync.get("lineDirection", function (data) {
  if (data.lineDirection === undefined) {
    chrome.storage.sync.set({ lineDirection: "TB" });
    document.getElementById("line-direction").value = "TB";
  } else {
    let select = document.getElementById("line-direction");
    select.value = data.lineDirection;
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === data.lineDirection) {
        select.options[i].selected = true;
        break;
      }
    }
  }
});

document
  .getElementById("language-select")
  .addEventListener("change", function (event) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.storage.sync.set({ language: event.target.value });
      chrome.tabs.sendMessage(tabs[0].id, {
        message: "languageChange",
        language: event.target.value,
      });
    });
  });

document
  .getElementById("text-direction")
  .addEventListener("change", function (event) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.storage.sync.set({ textDirection: event.target.value });
      chrome.tabs.sendMessage(tabs[0].id, {
        message: "text-direction-change",
        direction: event.target.value,
      });
    });
  });

document
  .getElementById("line-direction")
  .addEventListener("change", function (event) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.storage.sync.set({ lineDirection: event.target.value });
      chrome.tabs.sendMessage(tabs[0].id, {
        message: "line-direction-change",
        direction: event.target.value,
      });
    });
  });
