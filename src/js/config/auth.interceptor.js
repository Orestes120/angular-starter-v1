/**
 * This is a function to intercept any request to check authorization status.
 * 
 * @author: Ariel Cordoba
 * @param {object} JWT - 
 * @param {object} AppConstants -
 * @param {object} $window -
 * @param {object} $q -
 */
function authInterceptor(JWT, AppConstants, $window, $q) {
    'ngInject';

    return {
        request: function(config) {
            if(config.url.indexOf(AppConstants.api) === 0 && JWT.get()) {
                config.headers.Authorization = 'Token ' + JWT.get();
            }
            return config;
        },

        // Handle 401
        responseError: function(rejection) {
            if(rejection.status === 401) {
                JWT.destroy();

                $window.location.reload();
            }
            return $q.reject(rejection);
        }
    }
}

export default authInterceptor;