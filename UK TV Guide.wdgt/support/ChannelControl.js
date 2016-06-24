function ChannelControl(control, labelControl, selectedChannelModel, favouriteChannelsModel) {
    this._control = control;
    this._labelControl = labelControl;
    this._selectedChannelModel = selectedChannelModel;
    this._favouriteChannelsModel = favouriteChannelsModel;
    var me = this;
    
    this.refreshControl = function() {
        this._buildChannelList();
        
        if (!this._selectedChannelModel.channelSelected()) {
            this._updateForNowNext();
        } else {
            this._updateForChannel();
        }
    }
    
    this._buildChannelList = function() {
        this._control.options.length = 0;
            
        // add now and next selector
        this._control.options[0] = new Option("Now & Next", "now");
        this._control.options[1] = new Option("", "spacer");
        var j = 2;
        for (var i = 0; i < gFavouriteChannelsModel.getFavouriteChannels().length; i++) {
            var channelNumber= gFavouriteChannelsModel.getFavouriteChannels()[i];
            var channelName= TVPlugin.getChannelName(channelNumber);
            this._control.options[j] = new Option(channelName, channelNumber);
            j++;
        }
    }

    this._updateForNowNext = function() {
        this._control.selectedIndex = 0;
		this._changeChannelDropText("Now &amp; Next");
    }
    
    this._updateForChannel = function() {
        var channelNumber = this._selectedChannelModel.currentlySelectedChannel();
        var index = this._getIndexForChannel(channelNumber);
        
        if (index != false) {
            this._control.selectedIndex = index;
            this._changeChannelDropText(TVPlugin.getChannelName(channelNumber));
        }
    }
    
    this._getIndexForChannel = function(channelNumber) {
        for (var i= 0; i < this._control.length; i++) {
            if (this._control.options[i].value == channelNumber) {
                return i;
            }
        }
        return false;
    }
    
    this._changeChannelDropText = function(stringToDisplay) {
        this._labelControl.innerHTML= stringToDisplay;
    }

    this._noticeWidgetStateChange = function() {
        me.refreshControl();
    }
    
    this._selectedChannelModel.addObserver(this._noticeWidgetStateChange);
    this._favouriteChannelsModel.addObserver(this._noticeWidgetStateChange);
    
    // let's call the notice method once on startup, just to make sure everything
    // is set up properly
    this.refreshControl();
}