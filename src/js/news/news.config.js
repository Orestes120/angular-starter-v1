function NewsConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.news', {
            url: '/news/:slug',
            controller: 'NewsCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'news/news.html',
            title: 'News'
        });

};

export default NewsConfig;