// Utility functions for the UK TV Guide Widget
// © 2005-2010 Daniel Phillips
// uktvwidget@googlemail.com

// check to see if the specified XML file exists in the cache directory
function checkForXMLFile(filename) {
	var path = TVPlugin.getBasePath() + "/" + filename;
	return TVPlugin.doesFileExist(path);
}

// given a date, find the date for the next day
// note-- this function expects months numbered as january=1, feb=2, etc. and not jan=0 as with
// javascript dates
function addDayToDate(year, month, day, hour, minute) {
	// if we're on the 31st day of the month on a 31 day month
	if ((day == 31) && ((month == 1) || (month == 3) || (month == 5) || (month == 7) || (month == 8) || 
		(month == 10) || (month == 12))) {
		day= 1;
		if (month != 12) {
			month++;
		} else {
			year++;
			month= 1;
		}
	// if we're on the 30th day of a 30 day month
	} else if ((day == 30) && ((month == 4) || (month == 6) || (month == 9) || (month == 11))) {
		day= 1;
		month++;
	// if we're on the 29th february on a leap year
	} else if ((day == 29) && (month == 2) && (year % 4 == 0)) {
		day= 1;
		month++;
	// if we're on the 28th february on a non-leap year
	} else if ((day == 28) && (month == 2) && (year % 4 != 0)) {
		day= 1;
		month++;
	} else {
		day++;
	}
	return new Date(year, (month - 1), day, hour, minute);
}

//convert a javascript date object into a string in the following format dd/mm/yyyy
function formatToStdDate(inputDate) {
	var day= inputDate.getDate().toString();
	day= forceTo2Chars(day);

	var month= (inputDate.getMonth() + 1).toString();
	month= forceTo2Chars(month);

	var year= inputDate.getFullYear();
	return day + "/" + month + "/" + year;
}

// given the number of the day of the week, return a string containing the name of the day
function getDayName(dayNo) {
	switch (dayNo) {
		case 0: return "Sunday";
		case 1: return "Monday";
		case 2: return "Tuesday";
		case 3: return "Wednesday";
		case 4: return "Thursday";
		case 5: return "Friday";
		case 6: return "Saturday";
	}
	return "";
}

// ensure that a numeric string contains at least two characters- i.e. 1 becomes 01
function forceTo2Chars(input) {
	if (input.length != 2) {
		return "0" + input.charAt(0);
	}
	else {
		return input;
	}
}

// compare two dates
// if date 1 occurs later than date 2, return 1
// if date 1 occurs before date 2, return -1
// if date 1 occurs on the same day as date 2, return 0
function compareTextDates(dateString1, dateString2) {
    var year1 = parseInt(
        dateString1.charAt(6) + dateString1.charAt(7) + dateString1.charAt(8) + dateString1.charAt(9),
        10
    );
    
    var year2 = parseInt(
        dateString2.charAt(6) + dateString2.charAt(7) + dateString2.charAt(8) + dateString2.charAt(9),
        10
    );
    
    if (year1 > year2) {
        return 1;
    }
    if (year1 < year2) {
        return -1;
    }
    
	month1= parseInt(dateString1.charAt(3) + dateString1.charAt(4), 10);
	month2= parseInt(dateString2.charAt(3) + dateString2.charAt(4), 10);
	
	if (month1 > month2)
		return 1;
	
	if (month1 < month2)
		return -1;
	
	day1= parseInt(dateString1.charAt(0) + dateString1.charAt(1), 10);
	day2= parseInt(dateString2.charAt(0) + dateString2.charAt(1), 10);
	
	if (day1 > day2)
		return 1;
	
	if (day1 < day2)
		return -1;
		
	if (day1 == day2)
		return 0;
}

function compareDates(date1, date2) {
    var dateString1 = formatToStdDate(date1);
    var dateString2 = formatToStdDate(date2);
    
    return compareTextDates(dateString1, dateString2);
}

function findDayFromDateString(dateString) {
	var day= parseInt(dateString.charAt(0) + dateString.charAt(1), 10);
	var month= parseInt(dateString.charAt(3) + dateString.charAt(4), 10);
	var year= dateString.charAt(6) + dateString.charAt(7) + dateString.charAt(8) + dateString.charAt(9);
	year= parseInt(year, 10);
	
	var newDate= new Date(year, (month - 1), day, 12, 0);
	return getDayName(newDate.getDay());
}

function convertToJsDate(dateString) {
    var day = parseInt(dateString.charAt(0) + dateString.charAt(1), 10);
    var month = parseInt(dateString.charAt(3) + dateString.charAt(4), 10);
    var year = parseInt(
        dateString.charAt(6) + dateString.charAt(7) + dateString.charAt(8) + dateString.charAt(9),
        10
    );
    return new Date(year, month - 1, day);
}