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
        "click button.select": "select"
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
                notes: MUSIC.notes,
                intervals: MUSIC.intervals,
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
        this.model.trigger('select', this.model);
    },

    /**
     * set current view active
     */
    activate: function () {
        this.$el.siblings().removeClass('active');
        this.$el.addClass('active');
    }

});