'use strict'
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const querystring = require('querystring');
const process = require('process');

const PaintBoardUrl = 'https://segonoj.site/paintboard';

let config;
let pic = [];
let board = [], last_board = [], waitpos = [], priority = [];
let lastGetBoardTime = 0, reqPaintPos = [];
let paints = 0;
let delta, lcorrect, speed, eTime;
let last_oktoken = 0, wrongtoken = 0
let usetoken = [];
let fail_tokens_flg = [];
let brk_flg = false;

main();

async function main() {
    getConfig();
    getPic();
    var tmp;
    while (true) {
        tmp = Date.now();
        if (tmp < config.startTimestamp * 1000) continue;
        if (tmp > config.endTimestamp * 1000) break;
        if (tmp - lastGetBoardTime > config.fetchTime) await countDelta();
        for (let user of config.tokens) {
            if (Date.now() - user.lastPaintTime < config.paintTime) continue;
            if (fail_tokens_flg[user.token]) continue;
            if (reqPaintPos.length) {
                user.lastPaintTime = Date.now();
                let data = reqPaintPos.shift();
                if (!await paintBoard(user, data)) {
                    reqPaintPos.push(data);
                }
                break;
            }
        }
    }
}

function getConfig() {
    try {
        config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));
        for (let user of config.tokens) {
            user.lastPaintTime = Date.now() - config.lastPaintTime;
        }
        console.log(`Token: ${config.tokens.length}`);
        last_oktoken = config.tokens.length;
        if (config.fetchTime < 5000) console.log("Warning: fetchTime < 5s");
        if (config.paintTime < 30000) console.log("Warning: paintTime < 30s");
    } catch (err) {
        console.log('Get Config Failed.');
        process.exit(1);
    }
}

function getReqPaintPos() {
    try {
        reqPaintPos = [];
        for (let p of pic) {
            for (let pix of p.map) {
                if (board[pix.x + p.x][pix.y + p.y] != pix.hex) {
                    if (config.random) {
                        reqPaintPos.push({
                            x: pix.x + p.x,
                            y: pix.y + p.y,
                            hex: pix.hex
                        });
                    } else {
                        if (waitpos[pix.x + p.x][pix.y + p.y] > 0) waitpos[pix.x + p.x][pix.y + p.y]--;
                        else {
                            reqPaintPos.push({
                                x: pix.x + p.x,
                                y: pix.y + p.y,
                                hex: pix.hex
                            });
                        }
                    }
                }
            }
        }
        while (reqPaintPos.length < last_oktoken) {
            for (let p of pic) {
                for (let pix of p.map) {
                    reqPaintPos.push({
                        x: pix.x + p.x,
                        y: pix.y + p.y,
                        hex: pix.hex
                    });
                    if (reqPaintPos.length >= last_oktoken) {
                        brk_flg = true;
                        break;
                    }
                }
                if (brk_flg) break;
            }
            if (brk_flg) {
                brk_flg = false;
                break;
            }
        }
        if (config.priority_mode) {
            reqPaintPos.sort((a, b) => {
                return priority[b.x][b.y] - priority[a.x][a.y];
            });
        }
    } catch (err) {
        var tmp = Date().toLocaleString();
        console.log(tmp, 'Load reqPaintPos Failed:', err);
    }
}

function getPic() {
    try {
        for (let p of config.pictures) {
            pic.push({
                x: p.x,
                y: p.y,
                map: JSON.parse(fs.readFileSync(path.join(__dirname, 'pic-json', p.id + '.json'), 'utf-8'))
            });
        }
    } catch (err) {
        console.log('Get Pictures Failed.');
        process.exit(1);
    }
}

async function paintBoard(user, data) {
    try {
        let res = await fetch(`${PaintBoardUrl}/paint`, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'referer': PaintBoardUrl
            },
            body: querystring.stringify({
                x: data.x,
                y: data.y,
                hex: data.hex,
                uid: user.uid,
                token: user.token
            })
        });
        var fetch_json = await res.json();
        if (fetch_json.status != 200) {
            var tmp = Date().toLocaleString();
            console.log(tmp, `Paint PaintBoard Failed, Code: ${fetch_json.status}, Data: ${fetch_json.data}`);
            if (fetch_json.status == 401) {
                if (!usetoken.includes(user.token)) usetoken.push(user.token), wrongtoken++;
                var tmp = Date().toLocaleString();
                console.log(tmp, `Wrong Token: ${user.uid}, ${user.token}`);
                fail_tokens_flg[user.uid] = true;
            }
        }
    } catch (err) {
        var tmp = Date().toLocaleString();
        if (err.message == "invalid json response body at https://segonoj.site/paintboard/paint reason: Unexpected token < in JSON at position 0") {
            console.log(tmp, `Paint PaintBoard Failed: Server error.`)
        } else {
            console.log(tmp, 'Paint PaintBoard Failed:', user.token, err.message);
        }
        return false;
    }
    return true;
}

async function countDelta() {
    lastGetBoardTime = Date.now();
    let correct = 0;
    let wrong = 0;
    try {
        let str = await fetch(PaintBoardUrl + '/board');
        board = (await str.text()).split('\n');
        if (!board[board.length - 1]) {
            board.pop();
        }
        var tmp = Date().toLocaleString();
        getReqPaintPos();
    } catch (err) {
        var tmp = Date().toLocaleString();
        console.log(tmp, 'Get PaintBoard While Counting Delta Failed:', err);
    }
    for (let p of pic) {
        for (let pix of p.map) {
            if (board[pix.x + p.x][pix.y + p.y] == pix.hex) correct++;
            else wrong++;
            if (last_board[pix.x + p.x][pix.y + p.y] != board[pix.x + p.x][pix.y + p.y]) {
                if (config.random) {
                    priority[pix.x + p.x][pix.y + p.y] += 1;
                } else {
                    waitpos[pix.x + p.x][pix.y + p.y] = 5;
                }
            }
        }
    }
    var tmp = Date().toLocaleString();
    console.log(`${tmp} Paint: \x1B[34m${isNaN(correct - lcorrect) ? 0 : correct - lcorrect}\x1B[0m, Remaining: \x1B[34m${wrong}\x1B[0m, WrongToken: \x1B[34m${wrongtoken}\x1B[0m.`);
    last_oktoken = config.tokens.length - wrongtoken;
    wrongtoken = 0;
    usetoken = []
    delta = paints - (correct - lcorrect);
    if (isNaN(delta)) delta = 0;
    paints = 0;
    speed = correct - lcorrect;
    if (isNaN(speed)) speed = "[Unknown]";
    lcorrect = correct;
    if (wrong == 0) eTime = "0s";
    else if (speed == "[Unknown]") eTime = "[Unknown]";
    else {
        eTime = wrong / speed * config.fetchTime / 1000;
        if (eTime < 0 || eTime == Infinity) eTime = "[Unknown]";
        else if (isNaN(eTime)) eTime = "[Unknown]";
        else {
            eTime = Math.ceil(eTime);
            var __Second = 1, __Minute = 1 * 60, __Hour = 1 * 60 * 60, __Day = 1 * 60 * 60 * 24;
            var _D = Math.floor(eTime / __Day);
            eTime -= _D * __Day;
            var _H = Math.floor(eTime / __Hour);
            eTime -= _H * __Hour;
            var _M = Math.floor(eTime / __Minute);
            eTime -= _M * __Minute;
            var _S = Math.floor(eTime / __Second);
            if (_D > 1) eTime = `${_D}days, ${_H}h, ${_M}min, ${_S}s`;
            else if (_D == 1) eTime = `${_D}day, ${_H}h, ${_M}min, ${_S}s`;
            else if (_H) eTime = `${_H}h, ${_M}min, ${_S}s`;
            else if (_M) eTime = `${_M}min, ${_S}s`;
            else eTime = `${_S}s`;
        }
    }
    var tmp = Date().toLocaleString();
    if (delta > 0) console.log(tmp, `Delta: \x1B[31m${delta}\x1B[0m, ETime: \x1B[34m${eTime}\x1B[0m.`);
    else console.log(tmp, `Delta: \x1B[32m${delta}\x1B[0m, ETime: \x1B[34m${eTime}\x1B[0m.`);
}