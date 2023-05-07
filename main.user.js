// ==UserScript==
// @name         Now Listening
// @name:tr      Now Listening
// @namespace    now-listening-Bababoy
// @version      1.0
// @description  Get your now-playing album on Pixelplace!
// @author       Bababoy
// @match        https://pixelplace.io/*
// @license      MIT
// @icon         https://i.imgur.com/6M8JApV.gif
// @grant        GM.xmlHttpRequest
// @connect      api.spotify.com
// @connect      accounts.spotify.com
// ==/UserScript==

// Get your token from https://developer.spotify.com/
// Your token should be permitted to read your current playing.
const APP_TOKEN = "YOUR_TOKEN_HERE";
// Customize your bio here
const bio_create = response => {
    const elapsed = response.progress_ms;
    const duration = response.item.duration_ms;
    const percentage = elapsed/duration;
    let bar = '';
    for (let i = 0;i < 20;i += 1) {
        if ((i/20)<=percentage) {
            bar += '=';
        } else {
            bar += '-';
        }
    }
    return `Playing: ${response.item.artists[0].name} - ${response.item.name} ${bar}`
};
// Time between each fetching of the current playing
const INTERVAL = 5000;

async function getStatus() {
    const response = (await GM.xmlHttpRequest({
        "url": "https://api.spotify.com/v1/me/player/currently-playing",
        "headers": {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Authorization": "Bearer  "+APP_TOKEN,
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site"
        },
        "method": "GET",
        "responseType": "json"
    })).response;
    return bio_create(response);
}

async function postBio(bio) {
    await fetch("https://pixelplace.io/api/post-bio.php", {
        "credentials": "include",
        "headers": {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "referrer": "https://pixelplace.io/74943-acex-guild-emblem",
        "body": "bio="+encodeURIComponent(bio),
        "method": "POST",
        "mode": "cors"
    });
}

async function interval() {
    const status = await getStatus();
    await postBio(status);
    setTimeout(interval, INTERVAL);
}

interval();
