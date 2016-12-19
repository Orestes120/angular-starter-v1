export default class User {
    constructor(JWT, AppConstants, $http, $state, $q) {
        'ngInject';

        this._JWT = JWT;
        this._AppConstants = AppConstants;
        this._$http = $http;
        this._$state = $state;
        this._$q = $q;

        // Object to store our user properties
        this.current = null;

    }

    getNotifications() {
        let deferred = this._$q.defer();

        //if (this.ensureAuthIs(true)) {
        this._$http({
            url: this._AppConstants.api + '/user/' +
                this.current.username +
                '/notifications',
            method: 'GET'
        }).then(
            (res) => {
                this.current.notifications = res.data.notifications;
                this.current.notificationsCount = res.data.notificationsCount;
                deferred.resolve(true);
            }
        );
        //}

        return deferred.promise;
    }

    attemptAuth(type, credentials) {
        let route = (type === 'login') ? '/login' : '';
        return this._$http({
            url: this._AppConstants.api + '/users' +
                route,
            method: 'POST',
            data: {
                user: credentials
            }
        }).then(
            (res) => {
                //Set the JWT token
                this._JWT.save(res.data.user.token);
                this.current = res.data.user;
                this.getNotifications();
                return res;
            }
        );
    }

    verifyAuth() {
        let deferred = this._$q.defer();

        // Check for JWT token first
        if (!this._JWT.get()) {
            deferred.resolve(false);
            return deferred.promise;
        }

        // If there's a JWT & user is already set
        if (this.current) {
            this.getNotifications();
            deferred.resolve(true);

            // If current user isn't set, get it from the server.
            // If server doesn't 401, set current user & resolve promise.
        } else {
            this._$http({
                url: this._AppConstants.api + '/user',
                method: 'GET'
            }).then(
                (res) => {
                    this.current = res.data.user;
                    this.getNotifications();
                    deferred.resolve(true);
                },
                (err) => {
                    this._JWT.destroy();
                    deferred.resolve(false);
                }
            );
        }

        return deferred.promise;
    }

    ensureAuthIs(bool) {
        let deferred = this._$q.defer();

        this.verifyAuth().then((authValid) => {
            if (authValid !== bool) {
                this._$state.go('app.home');
                deferred.resolve(false);
            } else {
                deferred.resolve(true);
            }
        })

        return deferred.promise;
    }

    logout() {
        this.current = null;
        this._JWT.destroy();

        //Hard reload
        this._$state.go(this._$state.$current, null, {
            reload: true
        });
    }
}