/*
 *Title: Not Found handler
 * Description: 404 Not Found handler
 *Author: Sazzadur Rahman
 *Date: 03/30/2023
 */

//  dependencies

// Module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(404, {
    message: "Your requested URl was not found",
  });
};

module.exports = handler;
