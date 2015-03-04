require.config({
    baseUrl: '../bower_components',
    paths: {
        zepto: 'zepto/zepto.min',
        underscore: 'underscore/underscore-min',
        net: '../scripts/common/net',
        touch:'../scripts/gmu/extend/touch',
        highlight:'../scripts/gmu/extend/highlight',
        gmu:'../scripts/gmu/core/gmu',
        event:'../scripts/gmu/core/event',
        widget:'../scripts/gmu/core/widget',
        suggestion:'../scripts/gmu/widget/suggestion'
    },
    shim:{
        'zepto': {
            exports: '$'
        },
        'gmu': {
            deps : [ 'zepto' ],
            exports: '$'
        },
        'touch': {
            deps : [ 'zepto' ],
            exports: '$'
        },
        'highlight': {
            deps : [ 'zepto' ],
            exports: '$'
        },
        'event': {
            deps : [ 'zepto' ],
            exports: '$'
        },
        'widget': {
            deps : [ 'zepto' ],
            exports: '$'
        },
        'suggestion': {
            deps : [ 'gmu' ],
            exports: 'gmu'
        }
    }
});