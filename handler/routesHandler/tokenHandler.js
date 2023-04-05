/*
 *Title: Token handler
 * Description: Handler to handle token related routes
 *Author: Sazzadur Rahman
 *Date: 04/05/2023
 */

//  dependencies
const data = require("../../lib/data");
const { hash } = require("../../helper/utilities");
const { createRandomString } = require("../../helper/utilities");
const { perseJSON } = require("../../helper/utilities");

// Module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
  let { firstName, lastName, phone, password, tosAgreement } =
    requestProperties.body;
  phone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : false;

  password =
    typeof password === "string" && password.trim().length > 0
      ? password
      : false;

  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      let hashedPassword = hash(password);
      if (hashedPassword === perseJSON(userData).password) {
        let tokenId = createRandomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone,
          id: tokenId,
          expires,
        };

        // store the token
        data.create("tokens", tokenId, tokenObject, (err) => {
          if (!err) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: "There was a problem in the server side!",
            });
          }
        });
      } else {
        callback(400, {
          error: "Password is not valid",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handler._token.get = (requestProperties, callback) => {
  // check the id is valid
  let { id } = requestProperties.queryStringObject;
  id = typeof id === "string" && id.trim().length === 20 ? id : false;

  if (id) {
    // lookup the token
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...perseJSON(tokenData) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, {
          error: "Requested token was not found",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested token was not found",
    });
  }
};

handler._token.put = (requestProperties, callback) => {
  let { id, extend } = requestProperties.body;
  id = typeof id === "string" && id.trim().length === 20 ? id : false;

  extend = typeof extend === "boolean" && extend === true ? true : false;

  if (id && extend) {
    data.read("tokens", id, (err, tokenData) => {
      let tokenObject = perseJSON(tokenData);
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 1000;
        // store the updated token
        data.update("tokens", id, tokenObject, (err) => {
          if (!err) {
            callback(200);
          } else {
            callback(500, {
              error: "There was a server side error",
            });
          }
        });
      } else {
        callback(400, {
          error: "Token already expired",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request",
    });
  }
};

handler._token.delete = (requestProperties, callback) => {
  // check the token if valid
  let { id } = requestProperties.queryStringObject;
  id = typeof id === "string" && id.trim().length === 20 ? id : false;

  if (id) {
    // lookup the user
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete("tokens", id, (err) => {
          if (!err) {
            callback(200, {
              message: "Token was successfully deleted!",
            });
          } else {
            callback(500, {
              error: "There was a server side error",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a server side error",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your server",
    });
  }
};

handler._token.verify = (id, phone, callback) => {
  data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        perseJSON(tokenData).phone === phone &&
        perseJSON(tokenData).expires > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
