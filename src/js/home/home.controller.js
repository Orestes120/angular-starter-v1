/**
 * Represents the Home Controller
 */
class HomeCtrl {
    /**
     * @constructor
     * @param {object} AppConstants - The constants object defined on the config folder
     */
    constructor(AppConstants) {
        'ngInject';

        this.appName = AppConstants.appName;
    }
}

export default HomeCtrl;