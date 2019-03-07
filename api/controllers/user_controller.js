'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 http://www.w3schools.com/js/js_strict.asp
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');

var User = require('./Users');

var jwt = require('jsonwebtoken');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
    getusers: getusers,
    getuser: getuser,
    insertuser : insertuser,
    updateuser : updateuser,
    deleteuser : deleteuser,
    signup : insertuser,
    signin : signin,
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function getuser(req, res) {
  var id = req.swagger.params.id.value;
  User.findById(id, function(err, user) {
    if (err) res.send(err);

    var userJson = JSON.stringify(user);
    // return that user
    res.json(user);
  });
}

function getusers(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}

  User.find(function (err, users) {
    if (err) res.send(err);
    // return the users
    res.json(users);
  });
}

function signin(req, res) {
    var userNew = new User();
    userNew.name = req.swagger.params.user.value.name;
    userNew.username = req.swagger.params.user.value.username;
    userNew.password = req.swagger.params.user.value.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) res.send(err);

        user.comparePassword(userNew.password, function(isMatch){
            if (isMatch) {
                var userToken = {id: user._id, username: user.username};
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        });


    });
}

function insertuser(req, res) {
  var user = new User();
  user.name = req.swagger.params.user.value.name;
  user.username = req.swagger.params.user.value.username;
  user.password = req.swagger.params.user.value.password;

  user.save(function(err) {
    if (err) {
      // duplicate entry
      if (err.code == 11000)
        return res.json({ success: false, message: 'A user with that username already exists. '});
      else
        return res.send(err);
    }

    res.json({ message: 'User created!' });
  });
}

function updateuser(req, res) {
    var id = req.swagger.params.id.value;
    User.findById(id, function(err, user) {
      if (err) res.send(err);

      if (user) {
          // update the users info only if its new
          if (req.swagger.params.user.value.name) user.name = req.swagger.params.user.value.name;
          if (req.swagger.params.user.value.username) user.username = req.swagger.params.user.value.username;
          if (req.swagger.params.user.value.password) user.password = req.swagger.params.user.value.password;

          // save the user
          user.save(function (err) {
              if (err) res.send(err);

              // return a message
              res.json({message: 'User updated!'});
          });
      }
    });
}

function deleteuser(req, res) {
  var id = req.swagger.params.id.value;
  User.remove({ _id: id }, function(err, user) {
    if (err) return res.send(err);

    res.json({ message: 'Successfully deleted' });
  });
}