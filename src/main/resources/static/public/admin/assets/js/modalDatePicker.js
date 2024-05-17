var currentYear = getCurrentYear();
var currentMonth = getCurrentMonth();
var currentDay = getCurrentDay();

var selectedDay = '';
var selectedInput ;

var monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذز', 'دی', 'بهمن', 'اسفند'];
var weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهار شنبه', 'پنجشنبه ‍', 'جمعه'];

function getDaysArrayByMonth(jYear, jMonth) {
    var arrDays = [];
    var names = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var daysInMonth = moment.jDaysInMonth(jYear, jMonth - 1);
    //console.log("bymethod : " + daysInMonth);
    while (daysInMonth) {
        var faDay = {
            "fullDate": jYear + '/' + jMonth + '/' + daysInMonth,
            "weekDay": moment(jYear + '/' + jMonth + '/' + daysInMonth, "jYYYY/jM/jD").format('dddd'),
            "weekOfMonth": 0,
            "Day": moment(jYear + '/' + jMonth + '/' + daysInMonth, "jYYYY/jM/jD").format('jD')
        };
        arrDays.push(faDay);
        daysInMonth--;
    }

    var week = 1;
    var newArraayDays = [];
    $.each(arrDays.reverse(), function (index, item) {

        var weekofday = 0;
        switch (item.weekDay) {
            case 'Saturday' :
                weekofday = 1;
                break;
            case 'Sunday' :
                weekofday = 2;
                break;
            case 'Monday' :
                weekofday = 3;
                break;
            case 'Tuesday' :
                weekofday = 4;
                break;
            case 'Wednesday' :
                weekofday = 5;
                break;
            case 'Thursday' :
                weekofday = 6;
                break;
            case 'Friday' :
                weekofday = 7;
                break;
        }

        var faDay = {
            "fullDate": item.fullDate,
            "weekDay": weekofday,
            "weekOfMonth": week,
            "Day": item.Day
        };
        if (item.weekDay == 'Friday') {
            week++;
        }
        newArraayDays.push(faDay);
    });

    return newArraayDays;
}

function getCurrentYear() {
    return parseInt(moment().format('jYYYY'));
}

function getCurrentMonth() {
    return parseInt(moment().format('jM'));

}

function getCurrentDay() {
    return parseInt(moment().format('jD'));
}

function getCurrentWeekDay() {
    var currentWeekDay = '';
    var dd = moment().format('dddd');
    switch (dd) {
        case 'Saturday' :
            currentWeekDay = weekDays[0];
            break;
        case 'Sunday' :
            currentWeekDay = weekDays[1];
            break;
        case 'Monday' :
            currentWeekDay = weekDays[2];
            break;
        case 'Tuesday' :
            currentWeekDay = weekDays[3];
            break;
        case 'Wednesday' :
            currentWeekDay = weekDays[4];
            break;
        case 'Thursday' :
            currentWeekDay = weekDays[5];
            break;
        case 'Friday' :
            currentWeekDay = weekDays[6];
            break;
    }
    $('#week-of-day').text(currentWeekDay);
}

$(document).ready(function () {
    getCurrentWeekDay();
    setTableItems();
    setBigName();
    getMonthData();
    selectedDay = currentYear + '/' + currentMonth + '/' + currentDay;
    removeCurrentDay();

});

function setBigName() {
    $('#big-month-name').text(monthNames[currentMonth - 1] + ' ' + currentYear);
    $('#big-day-name').text(currentDay);
}

function nextMonth() {
    if (currentMonth == 12) {
        currentYear++;
        currentMonth = 1;
    } else {
        currentMonth++;
    }
    getMonthData();
}

function previousMonth() {
    if (currentMonth == 1) {
        currentYear--;
        currentMonth = 12;
    } else {
        currentMonth--;
    }
    getMonthData();
}

function getMonthData() {
    clearDayData();
    $('#month-title').text(monthNames[currentMonth - 1] + ' ' + currentYear);
    var monthData = getDaysArrayByMonth(currentYear, currentMonth);
    //sole.log(monthData);
    $.each(monthData, function (index, item) {
        var td = $('tr[data-week="' + item.weekOfMonth + '"]').find('td[data-day="' + item.weekDay + '"]');
        td.text(item.Day);
        td.attr('data-date', item.fullDate);
    });
}

function clearDayData() {
    $('#month-day-table').find('td').not($('.week-name')).text('');
    $('#month-day-table').find('td').not($('.week-name')).attr('data-date', '');
}

$('#month-previous').on('click', function () {
    //console.log('pri click');
    previousMonth();
    removeCurrentDay();
});

$('#month-next').on('click', function () {
    //console.log('next click');
    nextMonth();
    removeCurrentDay();
});

$('.persian-date').on('click', function () {

    $('#exampleModal').modal('show');
});

$('#month-day-table').on('click', 'td', function () {

    var dateData = $(this).data('date');

    //console.log('select date = ' + dateData);

    if (dateData != '') {

        var td = $(this);
        $('#exampleModal').modal('hide');
        selectedInput.val(td.data('date'));
        currentDay = td.text();
        var weekOfDay = parseInt(td.data('day').toString());
        selectedDay = currentYear + '/' + currentMonth + '/' + currentDay;
        removeCurrentDay();
        $('#week-of-day').text(weekDays[weekOfDay - 1]);
        setBigName();
    }

});

function removeCurrentDay() {

    var old = $('#month-day-table').find('.c-datepicker__day--selected');
    if(old){
        old.removeClass('c-datepicker__day--selected');
    }

    console.log('selected day : ' + selectedDay);
    var td = $('td[data-date="' + selectedDay + '"]');
    if(td){
        td.addClass('c-datepicker__day--selected');
    }
}

function setTableItems() {

    for (var i = 1; i < 7; i++) {
        var tr = '<tr class="c-datepicker__days-row" data-week="' + i + '">';
        for (var m = 1; m < 8; m++) {
            tr += '<td class="week-day c-datepicker__day-body" data-day="' + m + '" data-date=""></td>';

        }
        tr += '</tr>';
        $('#month-days').append(tr);
    }

}

function getCurrentDateString() {
    return moment().format('jYYYY')  + '/' +  moment().format('jM')  + moment().format('jD')

}