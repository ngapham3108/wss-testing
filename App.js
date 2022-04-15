'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const server = express()
  .use((req, res) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    const connectionRemoteAddress = req.connection.remoteAddress;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>

    <body>
        <h1>HTTPS x-forwarded-for: ${xForwardedFor}<h1/>
        <h1>HTTPS remoteAddress: ${connectionRemoteAddress}<h1/>
        <h1 id="content1"><h1/>
        <h1 id="content2"><h1/>
        <script>
            let HOST = location.origin.replace(/^http/, 'ws')
            let ws = new WebSocket(HOST);
            ws.onmessage = (event) => {
                let [id, value] = event.data.split('*');
                document.getElementById(id).textContent = value;
            };
        </script>
    </body>

    </html>`);
    })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on('connection', (ws, req) => {
  console.log('Client connected');
  const xForwardedFor = req.headers['x-forwarded-for'];
  const socketRemoteAddress = ws._socket.remoteAddress;
  ws.send('content1*WSS x-forwarded-for: ' + xForwardedFor);
  ws.send('content2*WSS remoteAddress: ' + socketRemoteAddress);
  ws.on('close', () => console.log('Client disconnected'));
});
