var Chord = Backbone.Model.extend({

    defaults: {
        key: null,
        intervals: [],
        notes: []
    },

    initialize: function () {

        var self = this;
        this.listenTo(this, 'change', function () {
            if (0 === this.get('intervals').length) {
                this.set('notes', []);
                return false;
            }
            var root = Note.fromLatin(this.get('key'));
            var chord = root.add(this.get('intervals'));
            var notes = [];
            $.each(chord, function () {
                notes.push(this.latin());
            });
            this.set('notes', notes, {silent: true});
        });

    }

});