/*
 *Title: Handle Request Response
 * Description: handle request and response
 *Author: Sazzadur Rahman
 *Date: 03/30/2023
 */

//  Dependencies
const { StringDecoder } = require("string_decoder");
const url = require("url");
const { notFoundHandler } = require("../handler/routesHandler/notFoundHandler");
const routes = require("../routes");
const { perseJSON } = require("../helper/utilities");

// module scaffolding
const handler = {};

// handle request response
handler.handleReqRes = (req, res) => {
  // request handler
  // get the url and parse it
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parseUrl.query;
  const headerObject = req.headers;

  const requestProperties = {
    parseUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headerObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    requestProperties.body = perseJSON(realData);

    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      // return the final response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });

    // response handle
    // res.end("Hello Programmer");
  });
};

module.exports = handler;
