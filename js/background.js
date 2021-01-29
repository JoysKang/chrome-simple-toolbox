chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.pressEnter) {
        chrome.tabs.query({active: true}, function (tabs) {
            const tabId = tabs[0].id;
            chrome.debugger.attach({tabId: tabId}, "1.2");
            // chrome.debugger.sendCommand({ tabId: tabId }, 'Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode:13, nativeVirtualKeyCode: 13, macCharCode: 13 });
            // chrome.debugger.sendCommand({ tabId: tabId }, 'Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode:70, nativeVirtualKeyCode: 70, macCharCode: 70 });
            // chrome.debugger.sendCommand({ tabId: tabId }, 'Input.dispatchKeyEvent', { type: 'keyDown', windowsVirtualKeyCode:13, nativeVirtualKeyCode: 13, macCharCode: 13 });
            chrome.debugger.sendCommand({tabId: tabId}, 'Input.dispatchKeyEvent', {
                type: 'keyDown',
                windowsVirtualKeyCode: 27,
                nativeVirtualKeyCode: 27,
                macCharCode: 27
            });
            chrome.debugger.detach({tabId: tabId});
        })
    }
})
