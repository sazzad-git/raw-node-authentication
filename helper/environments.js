/*
 *Title: Environments
 * Description: handle all environment thinks
 *Author: Sazzadur Rahman
 *Date: 04/04/2023
 */

//  dependencies

// module scaffolding
const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "hsjdhsdhsjdhjshdjshd",
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "hsjdhsdhsjdhjgsfdjshd",
};

// determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

//   export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// export module
module.exports = environmentToExport;
