// TODO: background script
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed!");
});

// Listener for when URL changes
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if(changeInfo.status === 'complete') {
    console.log("URL has changed");
    console.log(tab.url); 
    chrome.tabs.sendMessage(tabId, {
      type: 'URL_CHANGE',
      url: tab.url
    })
  }
});