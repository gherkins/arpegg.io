var Clock = Backbone.Model.extend({

    defaults: {
        playing: false,
        timeout: null,
        interval: 800 //ms
    },

    start: function () {
        this.trigger('start');
        this.set('playing', true);
        this.tick();
    },

    tick: function () {
        var self = this;

        this.set('timeout',
            setTimeout(function () {
                self.trigger('tick');
                self.tick();
            }, this.get('interval'))
        );

    },

    stop: function () {
        this.trigger('stop');
        this.set('playing', false);
        clearTimeout(this.get('timeout'));
    }


});