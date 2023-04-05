/*
 *Title: Routes
 * Description: Application routes
 *Author: Sazzadur Rahman
 *Date: 03/30/2023
 */

//  Dependencies
const { sampleHandler } = require("./handler/routesHandler/sampleHandler");
const { userHandler } = require("./handler/routesHandler/userHandler");
const { tokenHandler } = require("./handler/routesHandler/tokenHandler");

//
const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
