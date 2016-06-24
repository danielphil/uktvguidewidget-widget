function SelectedChannelModel(favouriteChannelsModel) {
    this._currentlyDisplayedChannel = false;
    this._favouriteChannelsModel = favouriteChannelsModel;
    this._observers = new Array();
    
    this.addObserver = function(observer) {
        this._observers.push(observer);
    }
    
    this.restoreFromPreferences = function() {    
        if(window.widget) {
            var previousChannel = widget.preferenceForKey("selectedChannel");
            if (typeof(previousChannel) != "undefined") {
                this._currentlyDisplayedChannel = previousChannel;
            }
        }
    }
    
    this.channelSelected = function() {
        return this._currentlyDisplayedChannel != false;
    }
    
    this.currentlySelectedChannel = function() {
        if (!this._favouriteChannelsModel.hasFavourite(this._currentlyDisplayedChannel)) {
            if (this._favouriteChannelsModel.getFavouriteChannels().length < 1) {
                return false;
            }
            this.setSelectedChannel(this._favouriteChannelsModel.getFavouriteChannels()[0]);
        }
        return this._currentlyDisplayedChannel;
    }
    
    this.setSelectedChannel = function(channelNumber) {
        if (this._currentlyDisplayedChannel == channelNumber) {
            return;
        }
        
        this._currentlyDisplayedChannel = channelNumber;
        	
		if (window.widget && this._currentlyDisplayedChannel != false) {
    		widget.setPreferenceForKey(this._currentlyDisplayedChannel,"selectedChannel");
		}
        
        this._notify();
    }
    
    this.setNowNextMode = function() {
        this._currentlyDisplayedChannel = false;
        this._notify();
    }
    
    this._notify = function() {
        for (observer in this._observers) {
            this._observers[observer]();
        }
    }
    
    this.restoreFromPreferences();
}