exports.checkUrl = function(str) {
    if (str === "") {
        return str;
    } else {
        if (str.startsWith("https://") || str.startsWith("http://")) {
            return str;
        } else {
            str = `http://${str}`;
            return str;
        }
    }
};
