// ==UserScript==
// @name         显示B站视频av号、BV号、弹幕CID
// @namespace    http://s.xmcp.ml/
// @version      0.1
// @description  不知道B站在搞什么飞机
// @author       xmcp
// @match        https://www.bilibili.com/video/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let elem=document.querySelector('#viewbox_report>.video-data:last-child');
    if(!elem) return;

    let showtxt='';

    function add(pref,txt) {
        if(txt) {
            showtxt+=(pref+txt+' · ').replace(/"/g,'\\"');
        }
    }

    add('av',window.aid);
    add('',window.bvid);
    add('cid=',window.cid);

    if(showtxt) {
        // some hack to avoid conflict with virtual dom

        // first put a content to ::before psuedo element, keeping virtual dom happy
        let style=document.createElement('style');
        style.textContent='#viewbox_report>.video-data:last-child::before {margin-right: .5em; visibility: hidden; content: "'+showtxt+'"}';
        document.head.appendChild(style);

        // but text in pseudo element is not selectable
        // we solve this by overlaying another div which is out of virtual dom
        let overlay=document.createElement('div');
        overlay.textContent=showtxt;
        overlay.style.color='#999';
        overlay.style.position='absolute';
        overlay.style.paddingRight='.5em';
        document.body.appendChild(overlay);
        console.log(overlay);

        // remember to keep it in the right position
        function repos() {
            let pos=elem.getBoundingClientRect();
            overlay.style.top=pos.y+'px';
            overlay.style.left=pos.x+'px';
        }
        repos();
        window.addEventListener('resize',()=>{
            repos();
            // if something is happening async
            setTimeout(repos,100);
        });
    }
})();
