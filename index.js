/*
 *Title: Uptime Monitoring Application
 *Description: A RESTFul API to monitor up or down time user defined links
 *Author: Sazzadur Rahman
 *Date: 03/29/2023
 */

// dependencies
const http = require("http");
const { handleReqRes } = require("./helper/handleReqRes");
const environment = require("./helper/environments");
const data = require("./lib/data");

// app object - module scaffolding
const app = {};

// testing file system
// data.create(
//   "test",
//   "newFile",
//   { name: "Bangladesh", language: "Bangla" },
//   (err) => {
//     console.log(`error was`, err);
//   }
// );

// read data
// data.read("test", "newFile", (err, data) => {
//   console.log(err, data);
// });

// update data
// data.update(
//   "test",
//   "newFile",
//   { name: "England", language: "English" },
//   (err) => {
//     console.log(err);
//   }
// );

// delete file
// data.delete("test", "newFile", (err) => {
//   console.log(err);
// });

// configuration
app.config = {};

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`listening to the port ${environment.port}`);
  });
};

// handle request response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
