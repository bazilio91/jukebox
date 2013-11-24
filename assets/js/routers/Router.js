define(['backbone', 'views/PlayerView'], function (Backbone, PlayerView) {
    return Backbone.Router.extend({

        routes: {
            "player": 'player',
            "help": "help",    // #help
            "search/:query": "search",  // #search/kiwis
            "search/:query/p:page": "search"   // #search/kiwis/p7
        },
        initialize: function(){

        },


        player: function () {
            var view = new PlayerView().render();
            $('#main').html(view.$el);
        }
    });
})