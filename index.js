const express = require("express");
// const app = express();
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
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
        secret: `I'm always angry.`,
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

app.get("/home", (req, res) => {
    res.send("<h1>Welcome home</h1>");
});

app.get("/welcome", (req, res) => {
    console.log("req.session: ", req.session);
    if (req.session.fakeCookieForDemo) {
        res.send("<h1>you have a cookie</h1>");
    } else {
        res.redirect("/home");
    }
});

app.post("/welcome", (req, res) => {
    req.session.wentToWelcome = "yeap";
    console.log("req.session: ", req.session);
    res.redirect("/home");
});

if (require.main === module) {
    app.listen(process.env.PORT || 8080, () => console.log("Im listening"));
}
