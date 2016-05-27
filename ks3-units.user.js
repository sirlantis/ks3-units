// ==UserScript==
// @name         KS3 Stats
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try to take over the world!
// @author       Marcel Jackwerth
// @match        https://www.kickstarter.com/projects/597507018/pebble-2-time-2-and-core-an-entirely-new-3g-ultra*
// @exclude      https://www.kickstarter.com/projects/597507018/pebble-2-time-2-and-core-an-entirely-new-3g-ultra/*
// @grant        none
// @run-at       document-body
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var STATS = {
      core: 0,
      two: 0,
      timeTwo: 0,
    };

    var rewards = document.querySelectorAll('.js-project-rewards > ol > li');
    [].forEach.call(rewards, function(reward) {
        var backersRaw = reward.querySelector('.pledge__backer-count').innerText.replace(',', '');
        var backers = Number(/([0-9]+)/.exec(backersRaw)[1]);
        var rewardInfo = reward.querySelector('.pledge__reward-description p:first-child').innerText;

        function unitsForName(name) {
            if (rewardInfo.indexOf('TWO ' + name) >= 0) {
                return backers * 2;
            } else if (rewardInfo.indexOf('ONE ' + name) >= 0) {
                return backers;
            } else {
                return 0;
            }
        }

        STATS.core += unitsForName('Pebble Core');
        STATS.two += unitsForName('Pebble 2');
        STATS.timeTwo += unitsForName('Pebble Time 2');
    });

    var container = document.createElement('div');
    container.style.textAlign = 'center';
    container.style.fontSize = '1.5em';
    container.style.backgroundColor = '#fff';
    container.style.padding = '10px';
    container.style.borderBottom = '1px solid #D9D9DE';
    document.querySelector('#start-of-content').appendChild(container);

    var counts = [["Pebble Core", STATS.core], ["Pebble 2", STATS.two], ["Pebble Time 2", STATS.timeTwo]];
    counts = counts.sort(function(a, b) {
        return a[1] - b[1];
    });

    var message = counts.map(function(s) {
        return "<b>" + s[0] + "</b> " + numberWithCommas(s[1]);
    }).join("&nbsp;&nbsp;&nbsp;<span style='opacity:0.33'>//</span>&nbsp;&nbsp;&nbsp;");

    container.innerHTML = "&#127881;&nbsp;&nbsp;&nbsp;" + message + "&nbsp;&nbsp;&nbsp;&#127881;";

    setTimeout(function() {
        window.location.reload();
    }, 60000);
})();
