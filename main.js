/*
*main.js
*BASE SETUP
*/

// required packages
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');    // call bodyParser
var mongoose = require('mongoose');         // call mongoose
var User = require('./app/models/user.js'); //call user schema

/*
* configure this app to use local mongodb
* configure app to use bodyParser()
* this will let us get the data from a POST
*/
mongoose.connect('mongodb://localhost:27017/user');     // connect to test mongodb
app.use(bodyParser.urlencoded({ extended: false }));        //url encoded body parser
app.use(bodyParser.json());     //json

var port = process.env.PORT || 8080;        // set our port

/*
 * ROUTES FOR OUR API  
 */

var router = express.Router();      // get an instance of the express Router

// middleware for requests
router.use(function (req, res, next) {
    console.log('next tick initiated'); //log something so we know it is working
    next(); //make sure we go to next route and not end it
});

// healthcheck for API
router.get('/api', function (req, res) {
    res.json({ message: 'API is up and running' });
})

// routes
//post the user to mongodb (accessed at POST http://localhost:8080/user)
router.route('/user')
    .post(function (req, res) {
        var user = new User();      //crete new user model
        user.name = req.body.name;      //set the users name, comes from the requests
        //save the user and check for errors
        user.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.json({ data: { message: 'User created' } });
            }
        })
    })

    //get the users from mongodb (accessed at GET http://localhost:8080/user)
    .get(function (req, res) {
        User.find(function (err, user) {
            if (err) {
                res.send(err);
            } else {
                res.json(user);
            }
        });
    });

router.route('/users/:user_id')
    // get the user with that id (accessed at GET http://localhost:8080/user/:user_id)
    .get(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                res.json(user);
            }
        });
    })

    // update the user with this id (accessed at PUT http://localhost:8080/user/:user_id)
    .put(function (req, res) {
        // use the user model to find the user we want
        User.findById(req.params.user_id, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                user.name = req.body.name;  // update the users info
            }
            // save the user
            user.save(function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({ message: 'User updated!' });
                }
            });
        })
    })
    // delete the user with this id (accessed at DELETE http://localhost:8080/user/:user_id)
    .delete(function (req, res) {
        User.remove({
            _id: req.params.user_id
        }, function (err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

/*
* REGISTER OUR ROUTES
*/

// all of the routes will be prefixed with only '/'
app.use('/', router);

/*
*START THE SERVER
*/

app.listen(port);
console.log('Server started on the following port: ' + port);