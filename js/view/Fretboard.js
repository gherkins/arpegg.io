var FretboardView = Backbone.View.extend({

    initialize: function () {
        this.render();
        this.listenTo(this.model, "change", this.showDots);
    },

    render: function () {
        var tpl = $("#fretboard-template").html();
        this.$el.html(Handlebars.compile(tpl));
        this.showDots();
    },

    showDots: function () {

        var self = this;
        this.$el.find('.fret span').fadeOut('fast');

        $.each(this.model.get('activeFrets'), function (string, fret) {
            self.showDot(string, fret, '');
        });

        $.each(this.model.get('activeRoots'), function (string, fret) {
            self.showDot(string, fret, 'root');
        });

    },

    showDot: function (string, fret, cssclass) {

        var span = $('<span></span>')
            .addClass('highlight')
            .addClass(cssclass);

        var fret = this.$el
            .find('.fret')
            .filter('[data-string="' + string + '"]')
            .filter('[data-fret="' + fret + '"]');

        fret.find('span').remove();
        fret.append(span);

    }

});