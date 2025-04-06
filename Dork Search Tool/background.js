chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "openTab") {
        chrome.tabs.create({ url: request.url }, function(tab) {
            sendResponse({ status: "done" });
        });

        return true; // Keep the message port open for the async response
    }
});
