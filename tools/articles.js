var _ = require('lodash');

module.exports = function(app, jwt) {

    var setHdr = function(res) {
        res.setHeader('Content-Type', 'application/json');
    }

    var articlesList = {
        "articles": [{
            "description": "Ever wonder how?",
            "slug": "how-to-train-your-dragon",
            "title": "How to train your dragon",
            "tagList": ["dragons", "training"],
            "createdAt": "2016-02-18T03:22:56.637Z",
            "updatedAt": "2016-02-18T03:48:35.824Z",
            "favorited": false,
            "favoritesCount": 0,
            "author": {
                "username": "jake",
                "bio": "I work at statefarm",
                "image": null,
                "following": false
            }
        }, {
            "description": "So toothless",
            "slug": "how-to-train-your-dragon-2",
            "title": "How to train your dragon 2",
            "tagList": ["dragons", "training"],
            "createdAt": "2016-02-18T03:22:56.637Z",
            "updatedAt": "2016-02-18T03:48:35.824Z",
            "favorited": false,
            "favoritesCount": 0,
            "author": {
                "username": "jake",
                "bio": "I work at statefarm",
                "image": null,
                "following": false
            }
        }],
        "articlesCount": 2
    }

    app.get('/api/articles', function(req, res, next) {
        console.log(req.headers);
    });

    /*app.options('/api/users', function(req, res, next){
        res.status(200).send({});
    });*/

    app.post('/api/users/login', function(req, res, next) {
        var found = _.find(usersList.users, {
            'email': req.body.user.email,
            'password': req.body.user.password
        });

        setHdr(res);
        if (found) {
            var token = jwt.sign(found, app.get(
                'superSecret'), {
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
        } else {
            var errors = {
                "errors": {
                    "username or password": [
                        "is invalid"
                    ]
                }
            };
            res.status(422).send(errors);
        }
    });

}