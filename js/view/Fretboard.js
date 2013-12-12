var FretboardView = Backbone.View.extend({

    events: {
        "change .focus": "setFocus"
    },

    initialize: function () {
        this.render();
        this.listenTo(this.model, "change:activeFrets", this.showDots);
    },

    render: function () {
        var tpl = $("#fretboard-template").html();
        this.$el.html(Handlebars.compile(tpl));
        this.showDots();
        this.setFocus();
    },

    showDots: function () {
        var self = this;
        this.$el.find('.fret span').fadeOut('fast');

        $.each(this.model.get('activeFrets'), function () {
            self.showDot(this, '');
        });
    },

    showDot: function (fret) {

        var span = $('<span></span>')
            .text(fret.text)
            .addClass('highlight')
            .addClass(fret.cssclass);

        var fret = this.$el
            .find('.fret')
            .filter('[data-string="' + fret.string + '"]')
            .filter('[data-fret="' + fret.fret + '"]');

        fret.find('span').remove();
        fret.append(span);

    },

    setFocus: function (e) {

        var focus = {
            string: this.$el.find('.focus[data-focus="string"]').val(),
            fret: this.$el.find('.focus[data-focus="fret"]').val()
        }

        this.model.set('focus', focus);

        this.$el
            .find('.fret')
            .removeClass('focus')
            .filter('[data-string="' + focus.string + '"]')
            .filter('[data-fret="' + focus.fret + '"]')
            .addClass('focus');

    }

});