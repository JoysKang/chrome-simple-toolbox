let show_list = ["cache", "history-record", "extensions", "history", "gmail",
    "calendar", "label", "close-label"]

// 初始化选中状态
function init(start) {
    chrome.storage.sync.get(['s_show_list'], function (result) {

        if (start === true) {
            chrome.storage.sync.remove('s_show_list', function(){});
        }

        if (result.s_show_list === undefined) {
            show_list.forEach(function (s) {
                let option = document.getElementById(s)
                option.checked = true
            })
            // 初始化显示的选项
            // 使用 Chrome 扩展程序的存储 API 保存它。
            chrome.storage.sync.set({'s_show_list': show_list}, function () {
                console.log("option written");
            })
        } else {
            result.s_show_list.forEach(function (s) {
                let option = document.getElementById(s)
                option.checked = true
            })
        }
    })
}

// 初始化
init()
let initialize = document.getElementById("initialize")
initialize.onclick = function() {
    init(true);
    alert("初始化完成！")
    location.reload()
}

let options = document.getElementsByClassName("switch")
for (let i = 0; i < options.length; i++) {
    options[i].onclick = function change() {
        let id = this.id
        let checked = this.checked

        chrome.storage.sync.get(['s_show_list'], function (result) {
            if (checked) {
                result.s_show_list.push(id)
                // 使用 Chrome 扩展程序的存储 API 保存它。
                chrome.storage.sync.set({'s_show_list': result.s_show_list}, function () {
                    console.log("new option written");
                })
            } else {
                result.s_show_list.splice(result.s_show_list.findIndex(item => item === id), 1)
                // 使用 Chrome 扩展程序的存储 API 保存它。
                chrome.storage.sync.set({'s_show_list': result.s_show_list}, function () {
                    console.log("option remove");
                })
            }
        })
    }
}
