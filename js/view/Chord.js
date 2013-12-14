/**
 * view for chord
 */
var ChordView = Backbone.View.extend({


    /**
     * tag name for elemetn
     */
    tagName: "div",

    /**
     * classname of element
     * @type String
     */
    className: "chord",

    /**
     * event bindings
     */
    events: {
        "change input,select": "updateModel",
        "click button.remove": "kill",
        "click": "select",
        "click button.play": "play"
    },

    /**
     * init
     * @param options
     */
    initialize: function (options) {
        this.container = options.container;
        this.id = options.id; //dom id for labels
        this.render();

        this.listenTo(this.model, 'select', this.activate);
        this.activate();

    },

    /**
     * render template
     */
    render: function () {
        var tpl = $("#chord-template").html();

        this.$el
            .html(Handlebars.compile(tpl)({
                notes: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
                intervals: {
                    'unison': '1',
                    'minor second': 'b2',
                    'major second': '2',
                    'minor third': 'b3',
                    'major third': '3',
                    'fourth': '4',
                    'diminished fifth': 'b5',
                    'fifth': '5',
                    'minor sixth': 'b6',
                    'major sixth': '6',
                    'minor seventh': 'b7',
                    'major seventh': '7',
                    'octave': '12'
                },
                id: this.id
            }))
            .appendTo(this.container);

        //enable unison interval by default
        this.$el
            .find('.interval:first')
            .prop('checked', true)
            .prop('disabled', true);

        //write intervals to model
        this.updateModel();
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
        this.select();
    },

    /**
     * destroy model
     * remove view
     */
    kill: function () {
        this.model.destroy();
        this.remove();
    },

    /**
     * trigger select event on model
     */
    select: function () {
        if (this.$el.hasClass('active')) {
            return;
        }
        this.model.trigger('select', this.model);
    },

    /**
     * playback event
     */
    play: function () {
        this.model.trigger('play', this.model);
    },

    /**
     * set current view active
     */
    activate: function () {
        this.$el.siblings().removeClass('active');
        this.$el.addClass('active');
    }

});