'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const server = express()
  .use((req, res) => {
    const remoteIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
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
        <h1>HTTPS req ip: ${remoteIP}<h1/>
        <h1 id="wss"><h1/>
        <script>
            let HOST = location.origin.replace(/^http/, 'ws')
            let ws = new WebSocket(HOST);
            ws.onmessage = (event) => {
                document.getElementById("wss").textContent = 'WSS req ip: ' + event.data;
            };
        </script>
    </body>

    </html>`);
    })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on('connection', (ws, req) => {
  console.log('Client connected');
  const remoteIP = req.headers['x-forwarded-for'] || ws._socket.remoteAddress;
  ws.send(remoteIP);
  ws.on('close', () => console.log('Client disconnected'));
});
