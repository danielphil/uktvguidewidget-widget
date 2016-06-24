// UK TV Guide Widget
// © 2005-2010 Daniel Phillips
// uktvwidget@googlemail.com

var lookedForNewListing;
var nowNextHTML;
var nowNextFirst = 0;
var nowNextLast = 2;
var prefsShown;
var listingDetailsShown;
var listingDetailsID;
var refreshTimerID;
var selectedDateIndex;
var versionCheckRequest;
var newWidgetVersionAvailable = false;
var gListingScrollArea, gListingScrollbar;
var gInfoButton;
var gChannelControl;
var gDateControl;
var gSelectedChannelModel;
var gSelectedDateModel;
var gFavouriteChannelsModel;

function changeStatus(stringToDisplay) {
	var statusHTML;
	if (newWidgetVersionAvailable) {
		// fix this URL!
		var new_version_url = "http://tvguidewidget.appspot.com/"
		
		statusHTML = "A new widget version is available! <a class=\"normalLink\" ";
		statusHTML += "href=\"javascript:widget.openURL(";
		statusHTML += "'" + new_version_url + "'";
		statusHTML += ");\">";
		statusHTML += "Click here for more information.</a>";
	} else {
		statusHTML = stringToDisplay;
	}
	document.getElementById("statusDiv").innerHTML= statusHTML;
}

function clearRefreshTimer() {
	if (refreshTimerID != null) {
		clearTimeout(refreshTimerID);
		refreshTimerID= null;
	}
}

function searchForDayInListing(programmes, dateToFind) {
	for (i= 0; i < programmes.length; i++) {
		var programmeDate= programmes[i].getAttribute("date");
		var dateResult= compareTextDates(dateToFind, programmeDate);
		
		if (dateResult != 0)
			continue;
		else
			return true;
	}
	return false;
}

function downloadListingDataNowNext(channelNumber) {
	var intNumber= parseInt(channelNumber, 10);
	var result= TVPlugin.getListing(intNumber);
	
	if (result != 0) {
		nowNextHTML+= "<p class='error'>";
		nowNextHTML+= "Could not get listing information for this channel.";
		nowNextHTML+= "</p>";
		if (result == 1) {
			nowNextHTML+= "<p class='error'>";
			nowNextHTML+= "HTTP error while trying to download channel " + channelNumber + ".";
			nowNextHTML+= "</p>";
			return false;
		}
		if (result == 2) {
			nowNextHTML+= "<p class='error'>";
			nowNextHTML+= "Could not save listing for channel " + channelNumber + " to disk!";
			nowNextHTML+= "</p>";
			return false;
		}
	}
	changeStatus("Listing for channel " + channelNumber + "downloaded successfully");
	return true;
}

function prevButtonClicked(newStart, newEnd) {
	document.prevImage.src="images/prev_clicked.png";
	setTimeout("showNowNextWithWarning(" + newStart + "," + newEnd + ")", 0);
}

function nextButtonClicked(newStart, newEnd) {
	document.nextImage.src="images/next_clicked.png";
	setTimeout("showNowNextWithWarning(" + newStart + "," + newEnd + ")", 0);
}
	
function showNowNext(start, end) {
	var a;
	nowNextHTML= "";
	
	document.controls.selected_date.disabled= true;
	
	clearRefreshTimer();
	
	if (end > (gFavouriteChannelsModel.getFavouriteChannels().length - 1)) {
		end = gFavouriteChannelsModel.getFavouriteChannels().length - 1;
	}
	
	nowNextFirst= start;
	nowNextLast= end;
	
	if (!(start == 0)) {
		var newStart= start - 3;
		var newEnd= start - 1;
		if (newStart < 0) {
			newStart= 0;
			newEnd= 2;
			if (newEnd > (gFavouriteChannelsModel.getFavouriteChannels().length - 1)) {
				newEnd= gFavouriteChannelsModel.getFavouriteChannels().length - 1;
			}
		}
		nowNextHTML+= "<a href='javascript:prevButtonClicked(" + newStart + "," + newEnd + ")'>";
		nowNextHTML+= "<img src='images/prev_button.png' class='prevLink' name='prevImage'>";
		nowNextHTML+= "</a>";
	}
	else {
		nowNextHTML+= "<img src='images/prev_disabled.png' class='prevLink'>";
	}
	
	if (!(end == (gFavouriteChannelsModel.getFavouriteChannels().length - 1))) {
		var newStart= end + 1;
		var newEnd= end + 3;
		if (newEnd > (gFavouriteChannelsModel.getFavouriteChannels().length - 1)) {
			newEnd= gFavouriteChannelsModel.getFavouriteChannels().length - 1;
			newStart= newEnd - 2;
			if (newStart < 0)
				newStart= 0;
		}
		nowNextHTML+= "<a href='javascript:nextButtonClicked(" + newStart + "," + newEnd + ")'>";
		nowNextHTML+= "<img src='images/next_button.png' class='nextLink' name='nextImage'>";
		nowNextHTML+= "</a>";
	}
	else {
		nowNextHTML+= "<img src='images/next_disabled.png' class='nextLink'>";
	}
	
	nowNextHTML+= "<p class='nowSpacer'>";
	var dataFound;
	
	//step through each of the selected channels
	for (a= start; a <= end; a++) {
   		var channelNumber= gFavouriteChannelsModel.getFavouriteChannels()[a];
		nowNextHTML+= "<p class='nowChannelName'>";
		nowNextHTML+= TVPlugin.getChannelName(channelNumber);
		nowNextHTML+= "</p>";
		
		// check to see if a listing has already been cached, otherwise, download it
		if (!checkForXMLFile(channelNumber + ".xml")) {
			if (!downloadListingDataNowNext(channelNumber))
				continue;
		}
		
		var req = new XMLHttpRequest();
		var path= TVPlugin.getBasePath() + "/" + channelNumber +".xml";
		req.open("GET", path, false);
		req.send(null);
		var dom = req.responseXML;
		var programmes= dom.documentElement.getElementsByTagName("programme");

		var currentDate = new Date();

		var i= 0;
		var currentFound= false;
		var nextFound= false;
		dataFound= false;

		var nowShowingListNumber= 0;

		if (!searchForDayInListing(programmes, formatToStdDate(currentDate))) {
			if (!downloadListingDataNowNext(channelNumber))
				continue;
			else {
				req = new XMLHttpRequest();
				req.open("GET", path, false);
				req.send(null);
				dom = req.responseXML;
				programmes= dom.documentElement.getElementsByTagName("programme");
			}
		}
	
		nowNextHTML+= "<table>";
		
		for (i = 0; i < programmes.length; i++) {
			// extract the day, month and year from the date value supplied
			var programmeDate= programmes[i].getAttribute("date");
	
			var dateResult= compareTextDates(formatToStdDate(currentDate), programmeDate);
	
			if (dateResult != 0)
				continue;
	
			var day= programmeDate.charAt(0);
			day= day + programmeDate.charAt(1);
			day= parseInt(day, 10);

			var month= programmeDate.charAt(3);
			month= month + programmeDate.charAt(4);
			month= parseInt(month, 10);

			var year= programmeDate.charAt(6);
			year= year + programmeDate.charAt(7);
			year= year + programmeDate.charAt(8);
			year= year + programmeDate.charAt(9);
			year= parseInt(year, 10);

			var programmeEnd= programmes[i].getElementsByTagName("endTime");
			var programmeEndTime= programmeEnd[0].firstChild.nodeValue;

			var programmeEndHour= programmeEndTime.charAt(0);
			programmeEndHour= programmeEndHour + programmeEndTime.charAt(1);
			programmeEndHour= parseInt(programmeEndHour, 10);

			var programmeEndMinute= programmeEndTime.charAt(3);
			programmeEndMinute= programmeEndMinute + programmeEndTime.charAt(4);
			programmeEndMinute= parseInt(programmeEndMinute, 10);

			var programmeEndDate= new Date(year, (month - 1), day, programmeEndHour, programmeEndMinute);

			var programmeStart= programmes[i].getElementsByTagName("startTime");
			var programmeStartTime= programmeStart[0].firstChild.nodeValue;

			var programmeStartHour= programmeStartTime.charAt(0);
			programmeStartHour= programmeStartHour + programmeStartTime.charAt(1);
			programmeStartHour= parseInt(programmeStartHour, 10);

			var programmeStartMinute= programmeStartTime.charAt(3);
			programmeStartMinute= programmeStartMinute + programmeStartTime.charAt(4);
			programmeStartMinute= parseInt(programmeStartMinute, 10);
			var programmeStartDate= new Date(year, (month - 1), day, programmeStartHour, programmeStartMinute);

			// need to take date into account- what happens if the programme runs over midnight into the next day
			// if programme end hour is less than programme start hour then increase the day the programme ends
			// on by 1

			//programme runs onto the next day
			if (programmeEndDate < programmeStartDate) {
				programmeEndDate= addDayToDate(year, month, (day), programmeEndHour, programmeEndMinute);
			}
	
			if ((programmeEndDate > currentDate) && (currentDate >= programmeStartDate) && (currentFound == false)) {
				nowNextHTML+= "<tr class=\"onnow\">";
				currentFound= true;
				nowShowingListNumber= i;
				dataFound= true;
			}
			else if (currentFound && !(nextFound)) {
				nowNextHTML+= "<tr>";
				nextFound= true;
			}
			else {
				continue;
			}

			nowNextHTML+= "<td class=\"time\">";
			var programmeStart= programmes[i].getElementsByTagName("startTime");
			nowNextHTML+= programmeStart[0].firstChild.nodeValue + "</td><td>";
			nowNextHTML+= "<a class= \"unopened\" href=\"javascript:parent.showListing(true," + i + ",'" + formatToStdDate(currentDate) + "'," + channelNumber + ", false)\">";
			var programmeName= programmes[i].getElementsByTagName("name");
			nowNextHTML+= programmeName[0].firstChild.nodeValue;
			nowNextHTML+= "</a>";
			nowNextHTML+= "</td></tr>";
			if (nextFound)
				break;
		}
		if (dataFound == false) {
			nowNextHTML+= "<tr class='onnow'><td class='time'>";
			nowNextHTML+= "N/A</td>";
			nowNextHTML+= "<td>";
			nowNextHTML+= "<p class='error'>No schedule information currently available.</p>";
			nowNextHTML+= "</td></tr>";
		}
		nowNextHTML+= "</table>"
	}
	document.getElementById("listing").innerHTML= nowNextHTML;
	gListingScrollArea.refresh();
	//scrollContent(SCROLLBAR_TOP);
	changeStatus("Done");
}

function showNowNextWithWarning(start, end) {
    changeStatus("Please wait- generating Now &amp; Next and downloading listings (if necessary)...");
    setTimeout("showNowNext(" + start + "," + end + ");", 0);
}

function downloadListingData(channelNumber) {
	var intNumber= parseInt(channelNumber, 10);
	var result= TVPlugin.getListing(intNumber);
	
	if (result != 0) {
		document.getElementById("listing").innerHTML= "Could not get listing information for the currently selected channel.";
		if (result == "1") {
			changeStatus("HTTP error while trying to download channel " + channelNumber);
			return false;
		}
		if (result == "2") {
			changeStatus("Could not save listing for channel " + channelNumber + " to disk!");
			return false;
		}
	}
	//changeStatus("Listing for channel " + channelNumber + "downloaded successfully");
	return true;
}

function showListing(showDetails, programmeID, dateToDisplay, channelNumber, samePage) {
    // need to make sure that the date dropdown is correct
	document.controls.selected_date.disabled= false;
	
	clearRefreshTimer();
	
	if (!checkForXMLFile(channelNumber + ".xml")) {
		if (!downloadListingData(channelNumber))
			return;
	}
	
	if (showDetails) {
		listingDetailsShown= true;
		listingDetailsID= programmeID;
	}
	else {
		listingDetailsShown= false;
	}
	
	var req = new XMLHttpRequest();
	var path= TVPlugin.getBasePath() + "/" + channelNumber +".xml";
	req.open("GET", path, false);
	req.send(null);
	var dom = req.responseXML;
	var programmes= dom.documentElement.getElementsByTagName("programme");

	var currentDate = new Date();

	var i= 0;
	var currentFound= false;
	var dataFound= false;

	var currentProgrammeListCount= 0;
	var nowShowingListNumber= 0;
	
	if (!searchForDayInListing(programmes, dateToDisplay)) {
		if (!downloadListingData(channelNumber))
			return;
		else {
			req = new XMLHttpRequest();
			req.open("GET", path, false);
			req.send(null);
			dom = req.responseXML;
			programmes= dom.documentElement.getElementsByTagName("programme");
		}
	}
	
	var outputHTML;
	outputHTML= "<table>";

	for (i = 0; i < programmes.length; i++) {
		//NEED TO CONVERT STRINGS INTO NUMBERS FOR DATE PROCESSING!!!
		// extract the day, month and year from the date value supplied
		var programmeDate= programmes[i].getAttribute("date");
	
		var dateResult= compareTextDates(dateToDisplay, programmeDate);
	
		if (dateResult != 0)
			continue;
		else
			dataFound= true;
	
		var day= programmeDate.charAt(0);
		day= day + programmeDate.charAt(1);
		day= parseInt(day, 10);

		var month= programmeDate.charAt(3);
		month= month + programmeDate.charAt(4);
		month= parseInt(month, 10);

		var year= programmeDate.charAt(6);
		year= year + programmeDate.charAt(7);
		year= year + programmeDate.charAt(8);
		year= year + programmeDate.charAt(9);
		year= parseInt(year, 10);

		var programmeEnd= programmes[i].getElementsByTagName("endTime");
		var programmeEndTime= programmeEnd[0].firstChild.nodeValue;

		var programmeEndHour= programmeEndTime.charAt(0);
		programmeEndHour= programmeEndHour + programmeEndTime.charAt(1);
		programmeEndHour= parseInt(programmeEndHour, 10);

		var programmeEndMinute= programmeEndTime.charAt(3);
		programmeEndMinute= programmeEndMinute + programmeEndTime.charAt(4);
		programmeEndMinute= parseInt(programmeEndMinute, 10);

		var programmeEndDate= new Date(year, (month - 1), day, programmeEndHour, programmeEndMinute);

		var programmeStart= programmes[i].getElementsByTagName("startTime");
		var programmeStartTime= programmeStart[0].firstChild.nodeValue;

		var programmeStartHour= programmeStartTime.charAt(0);
		programmeStartHour= programmeStartHour + programmeStartTime.charAt(1);
		programmeStartHour= parseInt(programmeStartHour, 10);

		var programmeStartMinute= programmeStartTime.charAt(3);
		programmeStartMinute= programmeStartMinute + programmeStartTime.charAt(4);
		programmeStartMinute= parseInt(programmeStartMinute, 10);
		var programmeStartDate= new Date(year, (month - 1), day, programmeStartHour, programmeStartMinute);

		// need to take date into account- what happens if the programme runs over midnight into the next day
		// if programme end hour is less than programme start hour then increase the day the programme ends
		// on by 1

		//programme runs onto the next day
		if (programmeEndDate < programmeStartDate) {
			programmeEndDate= addDayToDate(year, month, (day), programmeEndHour, programmeEndMinute);
		}
	
		if ((programmeEndDate > currentDate) && (currentDate >= programmeStartDate) && (currentFound == false)) {
			outputHTML+= "<tr class=\"onnow\" id=\"on_now\">";
			currentFound= true;
			nowShowingListNumber= currentProgrammeListCount;
		}
		else {
			outputHTML+= "<tr>";
		}

		outputHTML+= "<td class=\"time\">";
		var programmeStart= programmes[i].getElementsByTagName("startTime");
		outputHTML+= programmeStart[0].firstChild.nodeValue + "</td><td>";
		if ((showDetails == true) && (programmeID == i)) {
			outputHTML+= "<a class= \"opened\" href=\"javascript:parent.showListing(false," + i + ",'"+ dateToDisplay + "'," + channelNumber + ", true)\">";
		} else {
			outputHTML+= "<a class= \"unopened\" href=\"javascript:parent.showListing(true," + i + ",'" + dateToDisplay + "'," + channelNumber + ", true)\">";
		}
		var programmeName= programmes[i].getElementsByTagName("name");
		outputHTML+= programmeName[0].firstChild.nodeValue;
		outputHTML+= "</a>";
		outputHTML+= "<br>";
		if ((showDetails == true) && (programmeID == i)) {
			var programmeEpisode= programmes[i].getElementsByTagName("episode");
			if (programmeEpisode.length != 0)
				outputHTML += "<p class=\"episode\">" + programmeEpisode[0].firstChild.nodeValue + "</p>";
			var programmeCategory= programmes[i].getElementsByTagName("category");
			if (programmeCategory.length != 0)
				outputHTML+= "<p class=\"category\">" + programmeCategory[0].firstChild.nodeValue + "</p>";
			var programmeDescription= programmes[i].getElementsByTagName("description");
			if (programmeDescription.length != 0)
				outputHTML+= "<p class=\"description\">" + 	programmeDescription[0].firstChild.nodeValue + "</p>";		
			var programmeDuration= programmes[i].getElementsByTagName("duration");
			if (programmeDuration.length != 0)
				outputHTML+= "<p class=\"duration\">" + programmeDuration[0].firstChild.nodeValue + " minutes</p>";
		}
		outputHTML+= "</td></tr>";
		currentProgrammeListCount++;
	}
	outputHTML+= "</table>"
	if (dataFound == false) {
		outputHTML+= "Channel listings could not be found for the selected date.";
	}
	document.getElementById("listing").innerHTML= outputHTML;
	gListingScrollArea.refresh();

	//the user has just clicked a details link and hasn't selected another day or channel
	if (!samePage) {
        currentProgramme = document.getElementById("on_now");
        if (currentProgramme != null && typeof(currentProgramme) != "undefined") {
            gListingScrollArea.reveal(currentProgramme);
        }
	}
    gSelectedChannelModel.setSelectedChannel(channelNumber);
    var js_date = convertToJsDate(dateToDisplay);
    gSelectedDateModel.setSelectedDate(js_date);
	changeStatus("Done");
	refreshTimerID= setTimeout("refreshDisplay(false);", 60000);
}

function getSelectedDate() {
	var selected_date= document.controls.selected_date;
	selectedDateIndex= selected_date.selectedIndex;
	currentlyDisplayedDate = selected_date.options[selected_date.selectedIndex].value;
	return new Date(currentlyDisplayedDate);
}

function dateSelected() {
    gSelectedDateModel.setSelectedDate(getSelectedDate());
	showListing(
        false,
        0,
        formatToStdDate(gSelectedDateModel.getSelectedDate()),
        gSelectedChannelModel.currentlySelectedChannel(),
        false
    );
}

function channelSelected() {
	var selected_channel= document.controls.selected_channel;
	var chosenChannel= selected_channel.options[selected_channel.selectedIndex].value;
	if (chosenChannel == "now") {
        gSelectedChannelModel.setNowNextMode();
		showNowNextWithWarning(0, 2);
		return;
	} else if (chosenChannel == "spacer") {
		gChannelControl.refreshControl();
		return;
	} else {
		gSelectedChannelModel.setSelectedChannel(chosenChannel);
	
		showListing(
            false,
            0,
            formatToStdDate(gSelectedDateModel.getSelectedDate()),
            chosenChannel,
            false
        );
	}
}

function loadSelectedChannels() {
	if (checkForXMLFile("faveChannels.xml")) {
		var req = new XMLHttpRequest();
		var path= TVPlugin.getBasePath() + "/faveChannels.xml";
		req.open("GET", path, false);
		req.send(null);
	
		var dom = req.responseXML;
		var channels= dom.documentElement.getElementsByTagName("channel");
	
		var favForm= document.favChannels;
	
		for (i = 0; i < channels.length; i++) {
			var channelNumber= channels[i].getAttribute("number");
			eval("favForm.check" + channelNumber +".checked= true;");
		}
	}
}

function showPrefs() {
	clearRefreshTimer();
    var front = document.getElementById("front");
    var back = document.getElementById("back");
    var favouriteChannels= document.getElementById("favouriteChannels");
        
    if (window.widget)
        widget.prepareForTransition("ToBack");
    
    front.style.display="none";
    back.style.display="block";
    favouriteChannels.style.display="block";
    
    populateChannelList();
    loadSelectedChannels();
    
    displayDefaultHelp();
    
    prefsShown= true;
    if (window.widget)
        setTimeout ('widget.performTransition();', 0);  
}

function storeSelectedChannels() {
	var req = new XMLHttpRequest();
	var path= TVPlugin.getBasePath() + "/channels.xml";
	req.open("GET", path, false);
	req.send(null);
	
	var dom = req.responseXML;
	var channels= dom.documentElement.getElementsByTagName("channel");
	
	var favForm= document.favChannels;
	
	var selectedString= "";
	
	var oneChannelSelected= false;
	
	for (i = 0; i < channels.length; i++) {
		var channelNumber= channels[i].getAttribute("number");
		var channelName= channels[i].getAttribute("name");
		if (eval("favForm.check" + channelNumber +".checked")) {
			selectedString+= channelNumber + " ";
			oneChannelSelected= true;
		}
	}
	
	var result = gFavouriteChannelsModel.setFavouriteChannels(selectedString);
	if (result == 0)
		changeStatus("Selected channels saved successfully");
	else {
		changeStatus("An error occurred whilst saving selected channels");
		return false;
	}
	
	if (gFavouriteChannelsModel.getFavouriteChannels().length > 0)
		return true;
	else {
		changeStatus("Please select at least 1 channel to display.");
		return false;
	}
}

function hidePrefs() {
	if (!storeSelectedChannels())
		return;
	
    var front = document.getElementById("front");
    var back = document.getElementById("back");
	var favouriteChannels= document.getElementById("favouriteChannels");
	
	if (top.window.widget)
        widget.prepareForTransition("ToFront");
    
    front.style.display="block";
    back.style.display="none";
    favouriteChannels.style.display="none";
    
    nowNextFirst = 0;
    nowNextLast = 2;

    prefsShown= false;
    refreshDisplay(true);
    if (top.window.widget)
        setTimeout ('widget.performTransition();', 0);
}

function populateChannelList() {
	var req = new XMLHttpRequest();
	var path= TVPlugin.getBasePath() + "/channels.xml";
	req.open("GET", path, false);
	req.send(null);
	var dom = req.responseXML;
	var channels= dom.documentElement.getElementsByTagName("channel");
	var outputHTML;

	outputHTML= "<form name=\"favChannels\">";
	for (i = 0; i < channels.length; i++) {
		var channelNumber= channels[i].getAttribute("number");
		var channelName= channels[i].getAttribute("name");
		outputHTML+= "<input type=\"checkbox\" name=\"" + "check" + channelNumber + "\" ";
		outputHTML+= "value= \"" + channelNumber + "\">";
		outputHTML+= channelName + "<br>";
	}
	outputHTML+= "</form>";
	document.getElementById("favouriteChannels").innerHTML= outputHTML;
}

function fetchChannelList() {
	return TVPlugin.getChannelList();
}

// No track/key timers should be running while Dashboard is hidden.
function onHide () {
	clearRefreshTimer();
	clearTimer();
}

function refreshDisplay(scrollToCurrentProgramme) {
    gDateControl.refreshControl();
	if (!gSelectedChannelModel.channelSelected()) {
		showNowNextWithWarning(nowNextFirst, nowNextLast);
	} else {
		showListing(
            listingDetailsShown,
            listingDetailsID,
            formatToStdDate(gSelectedDateModel.getSelectedDate()),
            gSelectedChannelModel.currentlySelectedChannel(),
            !scrollToCurrentProgramme
        );
	}
}

function onShow() {
	if (!prefsShown) {
		refreshDisplay(true);
	}
}

function checkForNewVersion() {
	versionCheckRequest = new XMLHttpRequest();
	versionCheckRequest.onreadystatechange = checkForNewVersionCallback;
	versionCheckRequest.open("GET", "http://tvguidewidget.appspot.com/version.txt", true);
	versionCheckRequest.send("");
}

function checkForNewVersionCallback() {
	if (versionCheckRequest.readyState != 4) {
		return;
	};
	
	if (versionCheckRequest.status != 200) {
		alert("Widget version check failed.");
		return;
	}
	
	var currentVersion = "1.3";
	if (versionCheckRequest.responseText.indexOf(currentVersion) == -1) {
		newWidgetVersionAvailable = true;
		changeStatus("");
	} else {
		changeStatus("You are running the latest version of the widget.");
  }
}

function initWidget() {
    gFavouriteChannelsModel = new FavouriteChannelsModel();
    gSelectedChannelModel = new SelectedChannelModel(gFavouriteChannelsModel);
    gSelectedDateModel = new SelectedDateModel();
    
	gListingScrollbar = new AppleVerticalScrollbar(document.getElementById("listingScrollBar"));
	gListingScrollArea = new AppleScrollArea(document.getElementById("listing"));
	gListingScrollArea.addScrollbar(gListingScrollbar);
    gInfoButton = new AppleInfoButton(
        document.getElementById("infoButton"),
        document.getElementById("front"),
        "white",
        "white",
        showPrefs
    );
    
	nowNextDisplayed= false;
	prefsShown= false;
	lookedForNewListing= false;
	listingDetailsShown= false;
	selectedDateIndex= 0;
	refreshTimerID= null;
	
	if (!checkForXMLFile("channels.xml")) {
		changeStatus("Downloading channels list...");
		switch (fetchChannelList()) {
			case 0:
				alert("Channel list downloaded successfully.");
				break;
			case 1:
				changeStatus("A HTTP error occurred while downloading channel list.");
				break;
			case 2:
				changeStatus("Could not save downloaded channel list file to disk.");
				break;
		}
	}
	
    gChannelControl = new ChannelControl(
        document.controls.selected_channel,
        document.getElementById("channel_drop_text"),
        gSelectedChannelModel,
        gFavouriteChannelsModel
    );
    gDateControl = new DateControl(
        document.controls.selected_date,
        document.getElementById("date_drop_text"),
        gSelectedDateModel,
        gSelectedChannelModel
    );
    
	//The user hasn't chosen any channels or channels.xml could not be loaded
	if (!gFavouriteChannelsModel.hasAnyFavourites()) {
		changeStatus("Please select at least 1 channel to display");
		showPrefs();
		return;
	}
	
	if (window.widget)
	{
    	widget.onshow = onShow;
    	widget.onhide = onHide;
	}
}

function selectAllChannels() {
	var req = new XMLHttpRequest();
	var path= TVPlugin.getBasePath() + "/channels.xml";
	req.open("GET", path, false);
	req.send(null);
	
	var dom = req.responseXML;
	var channels= dom.documentElement.getElementsByTagName("channel");
	
	var favForm= document.favChannels;
	
	var selectedString= "";
	
	for (i = 0; i < channels.length; i++) {
		var channelNumber= channels[i].getAttribute("number");
		eval("favForm.check" + channelNumber +".checked= true");
	}
}

function selectNoChannels() {
	var req = new XMLHttpRequest();
	var path= TVPlugin.getBasePath() + "/channels.xml";
	req.open("GET", path, false);
	req.send(null);
	
	var dom = req.responseXML;
	var channels= dom.documentElement.getElementsByTagName("channel");
	
	var favForm= document.favChannels;
	
	var selectedString= "";
	
	for (i = 0; i < channels.length; i++) {
		var channelNumber= channels[i].getAttribute("number");
		eval("favForm.check" + channelNumber +".checked= false");
	}
}

function refreshChannelsClicked() {
	storeSelectedChannels();
	
	changeStatus("Downloading channels list...");
		switch (fetchChannelList()) {
			case 0:
				changeStatus("Channel list downloaded successfully.");
				break;
			case 1:
				changeStatus("A HTTP error occurred while downloading channel list.");
				return;
			case 2:
				changeStatus("Could not save downloaded channel list file to disk.");
				return;
		}
	
	document.getElementById("favouriteChannels").innerHTML= "";
	setTimeout("populateChannelList();", 0);
	setTimeout("loadSelectedChannels();", 0);
}

function disablePrefsButtons() {
	var favControls= document.favControls;
	var advancedControls= document.advancedControls;
	var exitB= document.exitB;
	
	favControls.SelAll.disabled= true;
	favControls.SelNone.disabled= true;
	
	advancedControls.reloadC.disabled= true;
	advancedControls.reloadL.disabled= true;
    advancedControls.versionCheck.disabled = true;
	
	exitB.done.disabled= true;
}

function enablePrefsButtons() {
	var favControls= document.favControls;
	var advancedControls= document.advancedControls;
	var exitB= document.exitB;
	
	favControls.SelAll.disabled= false;
	favControls.SelNone.disabled= false;
	
	advancedControls.reloadC.disabled= false;
	advancedControls.reloadL.disabled= false;
    advancedControls.versionCheck.disabled = false;

	exitB.done.disabled= false;
}

function downloadListingWithStats(i, total) {
	var messageText= "Please wait-- new channel listings are currently being downloaded for ";
	messageText+= "all selected channels.  This process may take a few minutes to complete.  Feel free to "; 
	messageText+= "leave Dashboard during the update process and downloading will continue in the background."; 
	
	changeHelpMessage(messageText);
	
    var channelNumber = gFavouriteChannelsModel.getFavouriteChannels()[i];
    var channelName = TVPlugin.getChannelName(channelNumber);
	changeStatus((i + 1) + "/" + total + " Downloading: " + channelName);
	if (!downloadListingData(channelNumber)) {
		displayDefaultHelp();
		enablePrefsButtons();
		return;
	}
	i++;
	if (i < total) {
		setTimeout("downloadListingWithStats("+i+","+total+");", 0);
	}
	else {
		changeStatus("Download complete.");
		displayDefaultHelp();
		enablePrefsButtons();
		return;
	}
}

function refreshListings() {
	if (!storeSelectedChannels())
		return;
	
	disablePrefsButtons();
	
	var i= 0;
    var numberOfChannels = gFavouriteChannelsModel.getFavouriteChannels().length;
	setTimeout("downloadListingWithStats(" + i + "," + numberOfChannels + ");", 0);
}