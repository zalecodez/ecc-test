listCollectionPaths = {
    Article: {
        many:'/articles',
        one: '/articles/:article',
    },
    Activity: {
        many: '/activities',
        one: '/activities/:activity',
    },

    ActivityPlan: {
        many: '/activityplans',
        one: '/activityplans/:plan',
    },

    ActionShot: {
        many: '/actionshots',
        one: '/actionshots/:shot',
    },

    Printable: {
        many: '/printables',
        one: '/printables/:printable',
    },
};

module.exports = listCollectionPaths;
