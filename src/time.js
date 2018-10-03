module.exports = {
    getDate: function() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        strDate = year + '-' + month + '-' + day;
        return strDate;
    }
}

