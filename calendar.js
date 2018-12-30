$(document).ready(function(){

    var calendar = $('.calendar');
    var today = new Date();
    var date = new Date();
    var selection = convertDayToString(today);
    
    /** initialize the base structure of the calendar */
    function init(){

        var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var head = week.map(function(day){
            return '<th>' + day + '</th>';
        }).join('');

        /** appends the base html objects for the table to the html side */
        var table = '<table class="table">' +

        '<div class="infobox">' + 
        '<div class="previous"><span>&larr;</span></div>' +
            '<span class="month"></span>' +                      
        '<div class="next"><span>&rarr;</span></div>' +
        '</div>' +

        '<thead><tr>' + 
            head +
        '</tr></thead>' +

        '<tbody>' +
        '</tbody>' +

        '</table>' +
        '<hr>' +
        '<div class="infobox">' +
        '<span class="date"></span>';

        var html = $(table);        
        calendar.append(html);
        setFoot(convertStringToDate(selection));
    }

    /** renders the fitting month content of the current selected month  */
    function update(date){

        /** calculates the beginning of the table (always a sunday) */
        var sDate = new Date(date);
        sDate.setMonth(sDate.getMonth());
        sDate.setDate(1);
        var sDay = sDate.getDay();
        sDate.setDate(sDate.getDate() - sDay);

        /** calculates the end of the table (always a saturday) */
        var eDate = new Date(date);
        eDate.setMonth(eDate.getMonth() + 1);
        eDate.setDate(0);      
        var eDay = eDate.getDay();
        var offset = 6 - eDay;
        eDate.setDate(eDate.getDate() + offset);

        /** calculates the day range between the start date and the end date of
         *  the current table object
         */
        var oneDay = 24 * 60 * 60 * 1000;
        var dayRange = Math.round(Math.abs((sDate.getTime() - eDate.getTime()) / (oneDay)) + 1);       
        
        /** clear calender body first before filling it with new content */
        var tBody = calendar.find('tbody');
        tBody.empty();

        /** fills the table rows and columns with values */
        for(i = 0; i < (dayRange / 7); i++){
            var row = $('<tr></tr>');
            for(var j = 0; j < 7; j++, sDate.setDate(sDate.getDate() + 1)){
                row.append(modify(sDate));                
            }
            tBody.append(row);
        }
    }

    /** calculates if the actual date is inside or outside the displayed month and 
     *  sets class variables to active or out (out of the current displayed month)
     */
    function modify(sDate){
        var cell = $('<td class="cell"></td>');        
        cell.text(sDate.getDate());

        var dateString = convertDayToString(sDate);        
        cell.data('date', dateString);

        /** decides if the actual cell is inside or outside the displayed month */
        if(sDate.getMonth() != date.getMonth()){
            cell.addClass('out');
        }

        /** looks for the selected date and sets the cell on active */
        if(selection == dateString && 
           convertStringToDate(selection).getMonth() == date.getMonth())
        {
            cell.addClass('active');
        }       
        return cell;        
    }

    /** converts a valid date into a string and fix month offset */
    function convertDayToString(cDate){
        var string = cDate.getFullYear() + "-" + 
                    (cDate.getMonth() + 1) + "-" + 
                     cDate.getDate();
        return string;
    }

    /** converts a string (YYYY-mm-dd) into a valid date */
    function convertStringToDate(dateString){
        var date = new Date(dateString);
        return date;
    }

    /** locates the table header and fills the content */
    function setHead(cDate){
        var head = $('.calendar').find('.month');
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                      'August', 'September', 'October', 'November', 'December'];       
        
        head.text(months[cDate.getMonth()] + " " + cDate.getFullYear());              
    }

    /** locates the table footer and fills the content */
    function setFoot(cDate){
        var foot = $('.calendar').find('.date');
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


        foot.text(days[cDate.getDay()] + ", " + ('0'+ cDate.getDate()).slice(-2) + "." + 
                 ('0' + (cDate.getMonth() + 1)).slice(-2) + "." + cDate.getFullYear());
    }
    
    /** handles the forward click on the topside */
    $(document).on('click', '.next', function(){
       date.setMonth(date.getMonth() + 1);
       date.setDate(1);
       setHead(date);       
       update(date);
    });

    /** handles the back click on the topside */
    $(document).on('click', '.previous', function(){
        date.setMonth(date.getMonth() - 1);
        date.setDate(1);
        setHead(date); 
        update(date);
    });

    /** handles every click on any cell of the table */
    $(document).on('click', '.cell', function () {
        var _this = $(this);
        var active = $('.table').find('.active');
        
        /** checks if the clicked cell is inside the displayed month or outside
         *  also sets the active class on the selected cell 
         */
        if(convertStringToDate(_this.data('date')).getMonth() == date.getMonth())
        {
            active.removeClass('active');
            _this.addClass('active');
            selection = _this.data('date');
            setFoot(convertStringToDate(selection));                               
        }        
    });
    
    /** startup functions when side gets loaded */
    init();    
    update(date);
    setHead(date);           
});

