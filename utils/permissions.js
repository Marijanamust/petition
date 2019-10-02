exports.hasSigned = function(req, res, next) {
    if (req.session.signatureId) {
        res.redirect("/thankyou");
    } else {
        next();
    }
};

exports.hasNotSigned = function(req, res, next) {
    if (!req.session.signatureId) {
        res.redirect("/petition");
    } else {
        next();
    }
};

exports.isNotLogged = function(req, res, next) {
    if (!req.session.user) {
        res.redirect("/register");
    } else {
        next();
    }
};

exports.isLogged = function(req, res, next) {
    if (req.session.user) {
        res.redirect("/petition");
    } else {
        next();
    }
};

exports.canAddInfo = function(req, res, next) {
    if (!req.session.user.canAddInfo) {
        res.redirect("/edit");
    } else {
        next();
    }
};
