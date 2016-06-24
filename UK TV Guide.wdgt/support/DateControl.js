function DateControl(control, labelControl, selectedDateModel, selectedChannelModel) {
    this._control = control;
    this._labelControl = labelControl;
    this._selectedDateModel = selectedDateModel;
    this._selectedChannelModel = selectedChannelModel;
    var me = this;
    
    this.refreshControl = function() {
        if (!this._selectedChannelModel.channelSelected()) {
            // in now/next mode
            this._changeDateDropText("N/A");
            document.controls.selected_date.disabled = true;
        } else {
            document.controls.selected_date.disabled = false;
            this._buildDateList();
            this._update();
        }
    }
    
    this._buildDateList = function() {
        this._control.options.length = 0;
        
        var dateToday= new Date();
        
        var dateText= "Today, " + formatToStdDate(dateToday);
        this._control.options[0]= new Option(dateText, dateToday);
                
        var i;
        var newDate = dateToday;
        
        for (i= 0; i < 8; i++) {
            newDate= addDayToDate(
                newDate.getFullYear(),
                (newDate.getMonth() + 1),
                newDate.getDate(),
                newDate.getHours(),
                newDate.getMinutes()
            );
            dateText= getDayName(newDate.getDay()) + ", " + formatToStdDate(newDate)
            this._control.options[i+1]= new Option(dateText, newDate);
        }
    }
    
    this._update = function() {
        for (var i = 0; i < this._control.options.length; i++) {
            var compare_result = compareDates(
                new Date(this._control.options[i].value),
                this._selectedDateModel.getSelectedDate()
            );
            
            if (compare_result == 0) {
                this._control.selectedIndex = i;
                this._changeDateDropText(this._control.options[i].text)
            }
        }
    }

    this._changeDateDropText = function(stringToDisplay) {
        this._labelControl.innerHTML = stringToDisplay;
    }
    
    this._noticeWidgetStateChange = function() {
        me.refreshControl();
    }
    
    this._selectedDateModel.addObserver(this._noticeWidgetStateChange);
    this._selectedChannelModel.addObserver(this._noticeWidgetStateChange);
    
    // let's call the notice method once on startup, just to make sure everything
    // is set up properly
    this.refreshControl();
}