function TimeTable(options) {
    this.buttonsContainer = options.buttonsContainer ? options.buttonsContainer : this.buttonsContainer;
    this.tableContainer = options.tableContainer ? options.tableContainer : this.tableContainer;
    this.jsonUrl = options.jsonUrl ? options.jsonUrl : this.jsonUrl;
    this.currentClass = options.currentClass ? options.currentClass : this.currentClass;
    this.direction = options.direction ? options.direction : this.direction;
}

TimeTable.prototype = {
    buttonsContainer: 'body',
    tableContainer: 'body',
    jsonUrl: 'db',
    direction: 'auto',
    currentClass: 'CLASS_9',

    constructor: TimeTable,

    build: function () {
        if (!this.classes) {
            $(this.tableContainer).append('<progress></progress>');
            var self = this;
            $.when(this.initClasses()).then(function() {
                $(self.tableContainer + ' progress').remove();
                self.buildButtons();
                self.buildTimeTable();
            });
        } else {
            this.buildButtons();
            this.buildTimeTable();
        }
    },

    initClasses: function () {
        var self = this;
        return $.get(this.jsonUrl, function (data) {
            self.classes = data.classes;
        });
    },

    buildButtons: function () {
        var gTemplate = _.template($('#myTemplate').html());
        var self = this;
        _.each(self.classes, function (cl) {
            $(self.buttonsContainer).append(gTemplate(cl));
        });
        $(this.buttonsContainer).find('button').on('click', function() {
            if (self.currentClass != $(this).data('id')) {
                self.currentClass = $(this).data('id');
                $(self.tableContainer + ' table').remove();
                self.buildTimeTable();
            }
        });
    },

    buildTimeTable: function () {
        switch (this.direction) {
            case 'auto':
                choseAuto.call(this);
                break;
            case 'horizontal':
                this.buildHorizontalTimeTable();
                break;
            case 'vertical':
                this.buildVerticalTimeTable();
                break;
        }
        function choseAuto() {
            if ($(this.tableContainer).width() > 750) {
                this.buildHorizontalTimeTable();
            } else {
                this.buildVerticalTimeTable();
            }
        }
    },

    buildHorizontalTimeTable: function () {
        var currentClass = _.findWhere(this.classes, {classId: this.currentClass});
        var tableTemplate = _.template($('#horizontalTableTemplate').html());
        $(this.tableContainer).append(tableTemplate(currentClass));
        var calculateMaxLessons = _.max(currentClass.days, function (sub) {
            return sub.subjects.length;
        });
        var maxLessonsCount = calculateMaxLessons.subjects.length;
        var dayTrTemplate = _.template($('#horizontalTrDayTemplate').html());
        for (var n = 0; n < maxLessonsCount; n++) {
            var lessons = [];
            _.each(currentClass.days, function (d) {
                var lCount = 1 + n;
                var currentLesson = d.subjects[n];
                if (typeof(currentLesson) === 'undefined') {
                    currentLesson = '-';
                }
                lessons.push({
                    name: currentLesson,
                    lCount: lCount
                })
            });
            $('.timeTable tbody').append(dayTrTemplate({lessons: lessons}));
        }
    },

    buildVerticalTimeTable: function () {
        var currentClass = _.findWhere(this.classes, {classId: this.currentClass});
        var tableTemplate = _.template($('#tableTemplate').html());
        $(this.tableContainer).append(tableTemplate(currentClass));
        var dayTemplate = _.template($('#trTdDayTemplate').html());
        _.each(currentClass.days, function (d) {
            $('.timeTable tbody').append(dayTemplate(d));
        });
    }
};