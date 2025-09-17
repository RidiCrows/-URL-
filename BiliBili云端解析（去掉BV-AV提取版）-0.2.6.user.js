// ==UserScript==
// @name         BiliBili云端解析（去掉BV/AV提取版）
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.2.6
// @description  直接基于当前页面URL拼接解析链接并复制，不再提取BV/AV号
// @author       Miro 鸭鸭 + 调整
// @match        https://www.bilibili.com/video*
// @match        https://www.bilibili.com/*bvid*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/watchlater/*
// @match        https://live.bilibili.com/*
// @match        https://music.163.com/song?id=*
// @downloadURL  https://raw.gitmirror.com/mmyo456/BiliAnalysis/main/BiliCloudAnalysis.user.js
// @updateURL    https://raw.gitmirror.com/mmyo456/BiliAnalysis/main/BiliCloudAnalysis.user.js
// @grant        GM_addStyle
// @require      https://i.ouo.chat/api/jquery-3.7.1.slim.min.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加提示框的样式
    GM_addStyle(`
        #notificationBox {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            padding: 20px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transition: all 0.5s ease;
            z-index: 9999;
        }
        #notificationBox h3 {
            color: #fff;
        }
        #notificationBox.show {
            bottom: 20px;
            opacity: 1;
        }
    `);

    // 创建提示框元素
    const notificationBox = document.createElement('div');
    notificationBox.id = 'notificationBox';
    notificationBox.innerHTML = `
        <img src="https://testingcf.jsdelivr.net/gh/mmyo456/BiliAnalysis-1@main/img/D26.gif" alt="图片" style="width: 50px; height: 50px;">
        <h3>解析成功</h3>
        <p>链接已复制到剪贴板</p>
    `;
    document.body.appendChild(notificationBox);

    // 创建右下角解析按钮
    var BiliAnalysisbutton = `<button id="BiliAnalysis8" style="z-index:999;width: 45px;height:45px;color: rgb(255, 255, 255); background: rgb(0, 174, 236); border: 1px solid rgb(241, 242, 243); border-radius: 6px; font-size: 14px;top:850px;right:0px;position:fixed;">云端</br>解析</button>`;
    $("body").append(BiliAnalysisbutton);
    document.getElementById('BiliAnalysis8').addEventListener('click', clickButton);

    // 创建左上角解析按钮
    var BiliAnalysisbutton1 = `<button id="BiliAnalysis9" style="z-index:999;width: 45px;height:45px;color: rgb(255, 255, 255); background: rgb(0, 174, 236); border: 1px solid rgb(241, 242, 243); border-radius: 6px; font-size: 14px;top:150px;left:0px;position:fixed;">云端</br>解析</button>`;
    $("body").append(BiliAnalysisbutton1);
    document.getElementById('BiliAnalysis9').addEventListener('click', clickButton);

    // 弹出提示框并复制链接
    function clickButton() {
        let url;
        const currentUrl = window.location.href;

        if (currentUrl.includes("music.163.com")) {
            // 处理网易云
            url = "https://biliplayer.91vrchat.com/player/?url=" + currentUrl;
        } else {
            // 直接基于当前页面URL
            const pID = currentUrl.match(/p=\d+/); // 支持多位数
            const pParam = pID ? pID[0] : "p=1";

            url = "https://biliplayer.91vrchat.com/player/?url=" + currentUrl + "&" + pParam;
        }

        // 复制到剪贴板
        navigator.clipboard.writeText(url).then(() => {
            notificationBox.classList.add('show');
            setTimeout(() => {
                notificationBox.classList.remove('show');
            }, 5000);
        }).catch(e => console.error(e));
    }
})();
