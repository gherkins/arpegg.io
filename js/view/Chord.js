var ChordView = Backbone.View.extend({

    tagName: "div",

    className: "chord",

    events: {
        "change input,select": "updateModel",
        "click button.remove": "kill",
        "click button.play": "play"
    },

    initialize: function (options) {
        this.container = options.container;
        this.id = options.id; //dom id for labels
        this.render();
    },

    /**
     * render template
     */
    render: function () {
        var tpl = $("#chord-template").html();

        this.$el
            .html(Handlebars.compile(tpl)({
                notes: MUSIC.notes,
                intervals: MUSIC.intervals,
                id: this.id
            }))
            .appendTo(this.container);

        this.updateModel();

        this.$el
            .find('.interval:first')
            .prop('checked', true)
            .prop('disabled', true);
    },

    /**
     * update the chord
     * model on form change
     */
    updateModel: function () {
        //set key
        this.model.set('key', this.$el.find('#key').val());
        //and intervals
        var intervals = [];
        $.each(this.$el.find('.interval:checked'), function () {
            intervals.push($(this).val());
        });
        this.model.set('intervals', intervals);
    },

    /**
     * destroy model
     * remove view
     */
    kill: function () {
        this.model.destroy();
        this.remove();
    },

    play: function () {
        this.model.set('notes', this.model.get('notes'));
    }

});