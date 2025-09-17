// ==UserScript==
// @name         Static M3U8 Extractor (Button Only)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  提取M3U8链接，只显示一个复制按钮，自动去掉播放器前缀
// @match        *://*.girigirilove.com/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const URL_PATTERN = /https?:\/\/[^\s"'<>]+\.m3u8(?:\?[^\s"'<>]*)?/gi;
    const TARGET_HOST = 'm3u8.girigirilove.com';
    const REMOVE_PREFIX = /^https:\/\/m3u8\.girigirilove\.com\/addons\/aplyer\/atom\.php\?key=0&url=/;
    let foundUrls = new Set();

    // 扫描DOM
    function scanDOM(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const matches = node.nodeValue.match(URL_PATTERN);
            if (matches) {
                matches.forEach(url => {
                    if (url.includes(TARGET_HOST)) {
                        foundUrls.add(url.trim());
                    }
                });
            }
            return;
        }
        ['src', 'href', 'data-src', 'data-url'].forEach(attr => {
            const value = node.getAttribute && node.getAttribute(attr);
            if (value && value.match(URL_PATTERN) && value.includes(TARGET_HOST)) {
                foundUrls.add(value.trim());
            }
        });
        node.childNodes.forEach(scanDOM);
    }

    // 创建小按钮
    function createButton() {
        if (document.getElementById('m3u8-copy-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'm3u8-copy-btn';
        btn.textContent = '📋 Copy M3U8';
        btn.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            background: #4CAF50; color: white; border: none;
            padding: 8px 12px; border-radius: 6px; cursor: pointer;
            font-size: 14px; box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        `;
        btn.onclick = () => {
            if (foundUrls.size === 0) {
                GM_notification({ title: 'M3U8 Extractor', text: 'No links found' });
                return;
            }
            const urls = Array.from(foundUrls).map(url =>
                url.replace(REMOVE_PREFIX, '')
            ).join('\n');
            GM_setClipboard(urls);
            GM_notification({
                title: 'M3U8 Extractor',
                text: `${foundUrls.size} cleaned links copied`
            });
        };

        document.body.appendChild(btn);
    }

    function main() {
        scanDOM(document.documentElement);
        if (foundUrls.size > 0) createButton();

        new MutationObserver(mutations => {
            let updated = false;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(scanDOM);
                if (mutation.addedNodes.length > 0) updated = true;
            });
            if (updated && foundUrls.size > 0) createButton();
        }).observe(document, {
            childList: true,
            subtree: true
        });
    }

    window.addEventListener('load', main, false);
})();
