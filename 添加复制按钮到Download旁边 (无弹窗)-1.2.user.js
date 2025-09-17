// ==UserScript==
// @name         添加复制按钮到Download旁边 (无弹窗)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在Download按钮右边添加复制按钮，点击后直接复制 mp4 地址
// @match        https://openani.an-i.workers.dev/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        // 找到所有 Download 按钮
        document.querySelectorAll("button[onclick*='location.href']").forEach(btn => {
            // 从 onclick 提取 mp4 地址
            let onclick = btn.getAttribute("onclick");
            let match = onclick.match(/'(https?:\/\/[^']+\.mp4)'/);
            if (!match) return;
            let url = match[1];

            // 创建复制按钮
            let copyBtn = document.createElement("button");
            copyBtn.textContent = "📋复制";
            copyBtn.style.marginLeft = "8px";
            copyBtn.className = "mdui-btn mdui-btn-raised mdui-btn-dense mdui-ripple";

            // 点击复制
            copyBtn.addEventListener("click", () => {
                GM_setClipboard(url, "text");
                copyBtn.textContent = "✅ 已复制";
                setTimeout(() => {
                    copyBtn.textContent = "📋复制";
                }, 1500); // 1.5 秒后恢复
            });

            // 插入到 Download 按钮后面
            btn.insertAdjacentElement("afterend", copyBtn);
        });
    });
})();
