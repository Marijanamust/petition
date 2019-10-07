const express = require("express");
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const { cookieSecret } = require("./secrets.json");
const csurf = require("csurf");
const { router: profileRouter } = require("./routes/profile-routes");
const { router: logRouter } = require("./routes/log-routes");
const { router: petitionRouter } = require("./routes/petition-routes");
const app = (exports.app = express());

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(
    cookieSession({
        secret: cookieSecret,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
app.use(csurf());
app.use(function(req, res, next) {
    res.setHeader("X-frame-Options", "DENY");
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(express.static("./public"));

app.use(profileRouter);
app.use(logRouter);
app.use(petitionRouter);

if (require.main === module) {
    app.listen(process.env.PORT || 8080, () => console.log("Im listening"));
}
