'use strict';

// 初始化选中状态
function init() {
    chrome.storage.sync.get(['s_show_list'], function (result) {
        if (result.s_show_list === undefined) {
            let show_list = ["cache", "history-record", "extensions", "history", "gmail",
                "calendar", "label", "close-label"]
            show_list.forEach(function (s) {
                let option = document.getElementById(s)
                option.style.display = "grid"
            })
            // 初始化显示的选项
            // 使用 Chrome 扩展程序的存储 API 保存它。
            chrome.storage.sync.set({'s_show_list': show_list}, function() {
                console.log("option written");
            })
        } else {
            result.s_show_list.forEach(function (s) {
                let option = document.getElementById(s)
                option.style.display = "grid"
            })
        }
    })
}
init()

// 清理历史记录、缓存
function ClearData(clear_option, time_obj) {
    let myselect = document.getElementById(time_obj);
    const index = myselect.selectedIndex
    let value = myselect.options[index].value
    let milliseconds
    switch(value) {
        case "1hour":
            milliseconds = 1000 * 60 * 60;
            break;
        case "1day":
            milliseconds = 1000 * 60 * 60 * 24;
            break;
        case "3day":
            milliseconds = 1000 * 60 * 60 * 24 * 3;
            break;
        case "7day":
            milliseconds = 1000 * 60 * 60 * 24 * 7;
            break;
        case "all_day":
            milliseconds = 1000 * 60 * 60 * 24 * 365 * 99
            break
        default:
            milliseconds = 0;
            break
    }

    if (milliseconds > 0) {
        let timeAgo = (new Date()).getTime() - milliseconds;
        chrome.browsingData.remove({
            "since": timeAgo
        }, clear_option, function () {
            alert("清理完成!！")
        });
    }
}

// 清除历史记录
let clear_history = document.getElementById('clear-history');
clear_history.onchange = function() {
    let clear_option = {
        "history": true
    };
    ClearData(clear_option, 'clear-history')
};

// 清除缓存
let clear_cache = document.getElementById('clear-cache');
clear_cache.onchange = function() {
    let clear_option = {
        "cache": true,
        "appcache": true,
        "cookies": true,
        "localStorage": true
    };
    ClearData(clear_option, 'clear-cache')
};


// 打开扩展程序页面
let extensions = document.getElementById('extensions');
extensions.onclick = function(element) {
    chrome.tabs.create({ url: "chrome://extensions" });
};

// 打开设置页面
let setting = document.getElementById('settings');
setting.onclick = function(element) {
    chrome.tabs.create({ url: "chrome://settings" });
};

// 打开书签管理器页面
let bookmarks = document.getElementById('bookmarks');
bookmarks.onclick = function(element) {
    chrome.tabs.create({ url: "chrome://bookmarks" });
};

// 打开历史记录页面
let history = document.getElementById('history');
history.onclick = function(element) {
    chrome.tabs.create({ url: "chrome://history" });
};

// 打开app页面
let apps = document.getElementById('apps');
apps.onclick = function(element) {
    chrome.tabs.create({ url: "chrome://apps" });
};

// 打开Gmail页面
let gmail = document.getElementById('gmail');
gmail.onclick = function(element) {
    chrome.tabs.create({ url: "https://mail.google.com/mail" });
};

// 打开calendar页面
let calendar = document.getElementById('calendar');
calendar.onclick = function(element) {
    chrome.tabs.create({ url: "https://calendar.google.com/calendar/r" });
};

// 打开webstore页面
let webstore = document.getElementById('webstore');
webstore.onclick = function(element) {
    chrome.tabs.create({ url: "https://chrome.google.com/webstore/category/extensions" });
};

// 隐藏标签页
let label = document.getElementById('label')
let open_label = document.getElementById('open-label')
// 已保存，则直接显示"重新打开标签"
chrome.storage.sync.get(['tab_url_list'], function (result) {
    if (result.tab_url_list.length !== 0) {
        //  隐藏标签
        label.style.display = "none";
        open_label.style.display = "grid";
    }
});
label.onclick = function () {
    chrome.tabs.query({}, function (tabs) {
        let tab_id_list = []
        let tab_url_list = []
        tabs.forEach(function (tab) {
            tab_id_list.push(tab.id)
            tab_url_list.push(tab.url)
        })

        // 使用 Chrome 扩展程序的存储 API 保存它。
        chrome.storage.sync.set({'tab_url_list': tab_url_list}, function() {
            // 关闭所有标签
            chrome.tabs.remove(tab_id_list)
            //  隐藏标签
            label.style.display = "none";
            open_label.style.display = "grid";
            // 打卡新的标签页
            chrome.tabs.create({}, function () {});
        });
    })
}

// 重新打开隐藏的标签页
open_label.onclick = function () {
    chrome.storage.sync.get(['tab_url_list'], function (result) {
        let url_list = result.tab_url_list.splice(',')
        url_list.forEach(function (url) {
            chrome.tabs.create({"url": url}, function () {
                // 显示隐藏标签
                label.style.display = "grid";
                open_label.style.display = "none";
            });
        })
    })

    // 清空存储
    chrome.storage.sync.set({'tab_url_list': ''}, function() {});
}

// 关闭所有标签页
let close_label = document.getElementById('close-label')
close_label.onclick = function () {
    chrome.tabs.query({}, function (tabs) {
        let tab_id_list = []
        tabs.forEach(function (tab) {
            tab_id_list.push(tab.id)
        });
        // 关闭所有标签
        chrome.tabs.remove(tab_id_list)
        // 打卡新的标签页
        chrome.tabs.create({}, function () {});
    })
}

// 打开开发者信息中心
let devconsole = document.getElementById('devconsole');
devconsole.onclick = function(element) {
    chrome.tabs.create({ url: "https://chrome.google.com/webstore/devconsole" });
};

// // test
// let test = document.getElementById('test');
// test.onclick = function(element) {
//     alert("aaa")
//     chrome.runtime.sendMessage({ pressEnter: true });
// };
