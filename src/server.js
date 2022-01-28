const express = require("express");
const next = require("next");
const Gun = require("Gun");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const client = next({ dev });
const handle = client.getRequestHandler();

client.prepare().then(() => {
  const app = express();

  app.use(Gun.serve);

  app.all("*", (req, res) => {
    return handle(req, res);
  });

  const server = app.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });

  Gun({ web: server });
});
