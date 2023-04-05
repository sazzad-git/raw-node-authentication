/*
 *Title: Sample handler
 * Description: Sample handler
 *Author: Sazzadur Rahman
 *Date: 03/30/2023
 */

//  dependencies

// Module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(200, {
    message: "This is sample message",
  });
};

module.exports = handler;
