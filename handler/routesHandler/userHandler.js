/*
 *Title: User handler
 * Description: User handler
 *Author: Sazzadur Rahman
 *Date: 04/05/2023
 */

//  dependencies
const data = require("../../lib/data");
const { hash } = require("../../helper/utilities");
const { perseJSON } = require("../../helper/utilities");
const tokenHandler = require("./tokenHandler");

// Module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
  let { firstName, lastName, phone, password, tosAgreement } =
    requestProperties.body;
  firstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName
      : false;

  lastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName
      : false;

  phone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : false;

  password =
    typeof password === "string" && password.trim().length > 0
      ? password
      : false;

  tosAgreement = typeof tosAgreement === "boolean" && tosAgreement;

  // return callback(200, {
  //   firstName,
  //   lastName,
  //   phone,
  //   password,
  //   tosAgreement,
  // });
  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure that the user doesn't already exists
    data.read("users", phone, (err) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        // store the user to db
        data.create("users", phone, userObject, (err1) => {
          // return callback(200, err);
          if (!err1) {
            callback(200, {
              message: "User was created successfully",
            });
          } else {
            callback(500, {
              error: "could not create user!",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a problem un server side!",
        });
      }
    });
  } else {
    callback(400, {
      error: "you have a problem in your request",
    });
  }
};

handler._users.get = (requestProperties, callback) => {
  // check the phone number is valid
  let { phone } = requestProperties.queryStringObject;
  phone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : false;

  if (phone) {
    // verify token
    const token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        data.read("users", phone, (err, u) => {
          const user = { ...perseJSON(u) };
          if (!err && user) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, {
              error: "Requested user was not found",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication failed!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested user was not found",
    });
  }
};

handler._users.put = (requestProperties, callback) => {
  let { firstName, lastName, phone, password, tosAgreement } =
    requestProperties.body;
  firstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName
      : false;

  lastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName
      : false;

  phone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : false;

  password =
    typeof password === "string" && password.trim().length > 0
      ? password
      : false;

  tosAgreement = typeof tosAgreement === "boolean" && tosAgreement;

  if (phone) {
    if (firstName || lastName || password) {
      // verify token
      const token =
        typeof requestProperties.headerObject.token === "string"
          ? requestProperties.headerObject.token
          : false;

      tokenHandler._token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          // lookup the user
          data.read("users", phone, (err, uData) => {
            const userData = { ...perseJSON(uData) };
            if (!err && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = hash(password);
              }
              // store to database
              data.update("users", phone, userData, (err) => {
                if (!err) {
                  callback(200, {
                    message: "User was updated successfully",
                  });
                } else {
                  callback(500, {
                    error: "There was a problem un the server side",
                  });
                }
              });
            } else {
              callback(400, {
                error: "You have a problem in your request",
              });
            }
          });
        } else {
          callback(403, {
            error: "Authentication failed!",
          });
        }
      });
    } else {
      callback(400, {
        error: "You have a problem in your request",
      });
    }
  } else {
    callback(400, {
      error: "Invalid phone number please try again",
    });
  }
};

handler._users.delete = (requestProperties, callback) => {
  // check the phone number is valid
  let { phone } = requestProperties.queryStringObject;
  phone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : false;

  if (phone) {
    // verify token
    const token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        data.read("users", phone, (err, userData) => {
          console.log(phone);
          console.log(err);
          if (!err && userData) {
            data.delete("users", phone, (err) => {
              if (!err) {
                callback(200, {
                  message: "User was successfully deleted!",
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
        callback(403, {
          error: "Authentication failed!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your server",
    });
  }
};

module.exports = handler;
