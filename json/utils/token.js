//==============================================================================
// ■ Token (token.js)
//------------------------------------------------------------------------------
//     Access tokens generation and verification utility functions.
//==============================================================================
const jwt = require("jsonwebtoken");

//------------------------------------------------------------------------------
// ● Exports
//------------------------------------------------------------------------------
module.exports = { sign, verify };

//------------------------------------------------------------------------------
// ● Secret-Or-Private-Key
//------------------------------------------------------------------------------
// TODO: Replace with a call to a random string generator.
const secretOrPrivateKey = "@a#m?b*r$a&t!o*l^m-s0e1c9r8e0t@";

//------------------------------------------------------------------------------
// ● Sign-Data
//------------------------------------------------------------------------------
function sign({ id, email, name }) {
  const payload = { email, name };
  const options = { subject: id, expiresIn: "30d" };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

//------------------------------------------------------------------------------
// ● Verify-Token
//------------------------------------------------------------------------------
function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPrivateKey, (err, accessData) => {
      if (err) {
        reject(err);
      } else {
        resolve(accessData);
      }
    });
  });
}