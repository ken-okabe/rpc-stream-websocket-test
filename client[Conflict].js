/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach, WebSocket */

'use strict';
console.log('client.js started');

var url = 'ws://localhost:9000';
var ws;

if (typeof(window) === 'undefined')
{
    console.log('running on node');
    var websocket1 = require('ws');
    ws = new websocket1(url);
}
else
{
    console.log('running on browser');
    ws = new WebSocket(url);
}
var WebSocketStream = require('stream-websocket');

var c = new WebSocketStream(ws);

var rpc = require('rpc-streamx');
var d = rpc();

c
    .pipe(d)
    .pipe(c)
    .on('close', function()
    {
        console.log('c close');
    })
    .on('error', function()
    {
        console.log('c error');
    })
    .on('finish', function()
    {
        console.log('c finish');
    });

d
    .rpc('hello',
        true, //must keep this format, true is dummy

        function(msg)
        {
            console.log(msg);
        });

d
    .rpc('hello1',
        'Ken',
        function(err, mess)
        {
            if (err) throw err;
            console.log(mess);

            c.end();
        });