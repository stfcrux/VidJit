const moment = require('moment');

module.exports = {
	formatDate: function(date, targetFormat){
		return moment(date).format(targetFormat);
    },
    
    radioCheck : function(value, radioValue){

        if (value === radioValue){
            return 'checked';
        }
        return '';
    },
    replaceCommas: function(str){
		if (str != null || str.length !== 0){
            // trim will cut away empt white spaceat the front and the back of the string
			if (str.trim().length !== 0) {
				// uses pattern-matching string /,/g for ','
				return str.replace(/,/g, ' | ');
			}
		}
		return 'None';
	},
};