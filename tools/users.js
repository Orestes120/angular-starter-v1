var _ = require('lodash');

module.exports = function(app, jwt) {

    var setHdr = function(res) {
        res.setHeader('Content-Type', 'application/json');
    }

    var usersList = {
        "users": [
            {
                "email": "jake@jake.jake",
                "token": null,
                "username": "jake",
                "password": "jakejake",
                "bio": "I work at statefarm",
                "image": null,
                "following": false
            }
        ]
    }

    app.get('/api/user', function(req, res, next){
        if( req.headers.authorization!= undefined){
            var token = req.headers.authorization.split(" ")[1];
            var found = _.find(usersList.users, { 'token': token });

            if(found){
                var retVal = {
                    "user": {
                        "email": found.email,
                        "token": token,
                        "username": found.username,
                        "bio": found.bio,
                        "image": found.image,
                        "following": found.following
                    }
                };
                res.status(200).send(retVal);
                return true;
            }else{
                var errors = {"errors":{"authorization missing":["is invalid"]}};
                res.status(422).send(errors);
                return false;
            }
        }
        var errors = {"errors":{"authorization missing":["is invalid"]}};
        res.status(422).send(errors);
    });

    app.get('/api/user/:username/notifications', function(req, res, next){
        //console.log(req.params.username);
        var notificationsList = {
            "notifications": [],
            "notificationsCount": 0
        };


        notificationsList.notifications.push({
            "id": "123",
            "title": "Nuevo Reto",
        });
        notificationsList.notificationsCount++;

        res.status(200).send(notificationsList);
    });

    app.post('/api/users/login', function (req, res, next) {
        var found = _.find(usersList.users, { 'email': req.body.user.email, 'password': req.body.user.password });

        //setHdr(res);
        if(found){
            var token = jwt.sign(found, app.get('superSecret'), {
                                    expiresIn: 86400 // expires in 24 hours
                                });
            
            found.token = token;

            var retVal = {
                "user": {
                    "email": found.email,
                    "token": token,
                    "username": found.username,
                    "bio": found.bio,
                    "image": found.image
                }
            };
            res.status(200).send(retVal);
        }else{
            var errors = {"errors":{"username or password":["is invalid"]}};
            res.status(422).send(errors);
        }        
    });
     
}