function SelectedDateModel() {
    this._currentlySelectedDate = new Date();
    this._observers = new Array();
    
    this.addObserver = function(observer) {
        this._observers.push(observer);
    }
    
    this.getSelectedDate = function() {
        this.refreshDate();
        return this._currentlySelectedDate;
    }
    
    this.refreshDate = function() {
        var today = new Date();
        // if the currently selected date is before today, then update the date
        // to today.  No-one cares about seeing past dates.
        if (compareDates(this._currentlySelectedDate, today) == -1) {
            this.setSelectedDate(today);
        }
    }
    
    this.setSelectedDate = function(date) {
        if (compareDates(this._currentlySelectedDate, date) == 0) {
            return;
        }
        this._currentlySelectedDate = date;
        this._notify();
    }
    
    this._notify = function() {
        for (observer in this._observers) {
            this._observers[observer]();
        }
    }
}