$(function () {
    var timeTable = new TimeTable({
        buttonsContainer: '#classList', // default 'body'
        tableContainer: '#classList', // default 'body'
        jsonUrl: 'db', // default 'db'
        currentClass: 'CLASS_9' // default 'CLASS_9'
        //direction: 'horizontal' // default 'auto' Available values: 'horizontal' & 'vertical'
    });
    timeTable.build();
});