/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';
console.log('client.js started');

if (typeof(window) === 'undefined')
{
    var WebSocket = require('ws');
}
var WebSocketStream = require('stream-websocket');
var ws = new WebSocket('ws://localhost:9000');
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