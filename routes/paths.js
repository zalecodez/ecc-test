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
        one: '/activityplans/:activityplan',
    },

    ActionShot: {
        many: '/actionshots',
        one: '/actionshots/:actionshot',
    },

    Printable: {
        many: '/printables',
        one: '/printables/:printable',
    },
};

module.exports = listCollectionPaths;
