/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';
console.log('app.js started');

var port = 9000;
console.log('Server port: ' + port);

var WebSocket = require('ws');
var WebSocketStream = require('stream-websocket');

var webSocketServer =
    new WebSocket.Server(
    {
        port: port
    })
    .on('connection',
        function(ws)
        {
            var c = new WebSocketStream(ws);
            var d = require('rpc-streamx');

            c
                .pipe(d(
                {
                    hello: function(val, f) // must keep this format
                    {
                        console.log('rpc:hello is called!');
                        f('hello');
                        f('hello');
                    },
                    hello1: function(val, f)
                    {
                        console.log('rpc:hello1 is called!');
                        f(null, 'hello!! ' + val);
                    }
                }))
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
        });