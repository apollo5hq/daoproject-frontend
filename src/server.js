const express = require("express");
const next = require("next");
const Gun = require("gun");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const client = next({ dev });
const handle = client.getRequestHandler();

// Prepare front end then start server
client.prepare().then(() => {
  const app = express();

  app.all("*", (req, res) => {
    return handle(req, res);
  });

  const server = app.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });

  // Create websocket server
  Gun({ web: server });
});
