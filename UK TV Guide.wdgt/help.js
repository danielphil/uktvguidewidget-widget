// UK TV Guide Widget
// © 2005-2010 Daniel Phillips
// uktvwidget@googlemail.com

var defaultText= "Please select at least one channel to display and click Done to exit preferences.";

function changeHelpMessage(stringToDisplay) {
	document.getElementById("helpMessage").innerHTML= stringToDisplay;
}

function displaySelAllMessage() {
	changeHelpMessage("Select all available channels.");
}

function displaySelNoneMessage() {
	changeHelpMessage("Deselect all channels.");
}

function displayRefChMessage() {
	changeHelpMessage("Reload the list of available channels from the server.  You must be connected to the Internet for this option to work.");
}

function displayRefListMessage() {
	changeHelpMessage("Download the latest version of the listings for every selected channel.  This operation may take a few minutes to complete and you must be connected to the Internet.");
}

function displayCheckVersionMessage() {
	changeHelpMessage("Check for updates to the widget.  You must be connected to the Internet to check for new versions of the widget.");
}

function displayChannelsMessage() {
	changeHelpMessage("Select the channels to be displayed in the View Listing menu and in Now &amp; Next.");
}

function displayDoneMessage() {
	changeHelpMessage("Save the selected channels and return to the TV guide.");
}

function displayDefaultHelp() {
	changeHelpMessage(defaultText);
}