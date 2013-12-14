var LoadSave = Backbone.Model.extend({

    defaults: {
        timeout: null
    },

    load: function (hash) {

        var data = null;

        try {
            data = JSON.parse($.base64.decode(decodeURIComponent(hash)));

            //set tempo
            $('.tempo').val(data.tempo).trigger('change');

            //set focus
            fretboard.model.set('focus', data.focus);

            $.each(data.chords, function () {
                $('.add-chord').trigger('click');
                var chord = $('.chord.active');
                chord.find('select').val(this.key);
                $.each(this.intervals, function (key, val) {
                    chord.find('input#' + val)
                        .prop('checked', true)
                        .trigger('change');
                });
                chord.trigger('click');
            });

            fretboard.showFocusRange();
            fretboard.showDots();

            return true;

        }
        catch (e) {
        }

        return false;

    },

    save: function () {
        var self = this;
        clearTimeout(this.get('timeout'));
        var timeout = setTimeout(function () {
            self.doSave();
        }, 500);
        this.set('timeout', timeout);
    },

    doSave: function () {
        var data = {
            chords: [],
            tempo: clock.get('tempo'),
            focus: fretboard.model.get('focus')
        };


        $('.chords .chord').each(function () {

            var chord = {
                key: $(this).find('select').val(),
                intervals: []
            }

            $(this).find('input:checked').each(function () {
                chord.intervals.push($(this).attr('id'));
            });

            data.chords.push(chord);

        });


        data = JSON.stringify(data);
//        data = encodeURIComponent(data);
        window.location.hash = $.base64.encode(data);
    }

});