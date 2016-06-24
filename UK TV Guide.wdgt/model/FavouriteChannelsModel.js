function FavouriteChannelsModel() {
    this._observers = new Array();
    this._channelNumbers = new Array();
    
    this.getFavouriteChannels = function() {
        return this._channelNumbers;
    }
    
    this.setFavouriteChannels = function(favouritesString) {
        var result = TVPlugin.saveFavourite(favouritesString);
        this._loadFromXml();
        this._notify();
        return result;
    }
    
    this.hasFavourite = function(channelNumber) {
        for (number in this._channelNumbers) {
            if (this._channelNumbers[number] == channelNumber) {
                return true;
            }
        }
        
        return false;
    }
    
    this.hasAnyFavourites = function() {
        return this._channelNumbers.length > 0;
    }
    
    this.addObserver = function(observer) {
        this._observers.push(observer);
    }
    
    this._notify = function() {
        for (observer in this._observers) {
            this._observers[observer]();
        }
    }
    
    this._loadFromXml = function() {
        if (!checkForXMLFile("faveChannels.xml")) {
            return;
        }
        
        var req = new XMLHttpRequest();
        var path= TVPlugin.getBasePath() + "/faveChannels.xml";
        req.open("GET", path, false);
        req.send(null);

        var dom = req.responseXML;
        var channels = dom.documentElement.getElementsByTagName("channel");
        
        this._channelNumbers = new Array();
        for (var i = 0; i < channels.length; i++) {
            channelNumber = channels[i].getAttribute("number");
            this._channelNumbers.push(channelNumber);
        }
    }
    
    this._loadFromXml();
}