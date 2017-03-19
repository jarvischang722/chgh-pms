/**
 * 時間格式轉換 datetime format
 * ex:
 * start_datetime = 2016-10-20 00:00:00
 * {{formatTime start_datetime  "YYYY / MM / DD"}} -> 2016 / 10 / 20
 */
var DateFormats = {

	current: "YYYY / MM / DD",
    current_time: "YYYY / MM / DD HH:mm",
    patternYMD : "YYYY/MM/DD",
    current2: "YYYY-MM-DD",
    HHmm: "HH:mm"
};

/**
 * 格是化時間
 * **/
Handlebars.registerHelper('formatTime', function (date, format) {
    var mmnt = moment(date);
    format = DateFormats[format] || format;
    return mmnt.format(format);
});

/**
 * index 加 1
 * **/
Handlebars.registerHelper("incAddOne", function (value) {
    return Number(value) + 1;
});

//Helper for condition
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

//        console.log("v1="+v1);
//        console.log("operator="+operator);
//        console.log("v2="+v2);
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});


//Helper for check array contains string
Handlebars.registerHelper("contains",  function( collection, item, options ){
    // string check
    if( typeof collection === 'string' ){
        if( collection.search( item ) >= 0 ){
            return options.fn(this);
        }
        else {
            return options.inverse(this);
        }
    }
    // "collection" check (objects & arrays)
    for( var prop in collection ){
        if( collection.hasOwnProperty( prop ) ){
            if( collection[prop] == item ) return options.fn(this);
        }
    }
    return options.inverse(this);
});


//substring!!
Handlebars.registerHelper('subString', function(passedString, startstring, endstring) {

    var theString = "";

    if(typeof passedString === 'string' ){
        theString = passedString.substring( startstring, endstring );
    }

    return new Handlebars.SafeString(theString)
});

/**
 * 相加
 * **/
Handlebars.registerHelper("inc", function (value, value2) {
    return Number(value) + Number(value2);
});

/**
 * 取餘數
 * **/
Handlebars.registerHelper("divide", function (value, value2) {
    return Number(value) % Number(value2);
});
