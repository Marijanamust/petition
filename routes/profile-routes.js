const express = require("express");
const router = (exports.router = express.Router());
const { hash } = require("../utils/bc");
const { isLogged, isNotLogged, canAddInfo } = require("../utils/permissions");
const {
    addRegister,
    getEditData,
    updateUserDataNoPass,
    updateUserDataPass,
    updateProfiles,
    addData
} = require("../utils/db.js");
const { checkUrl } = require("../utils/repetitive");

router.get("/register", isLogged, (req, res) => {
    res.render("register", {
        layout: "main",
        loginBtn: true
    });
});

router.post("/register", isLogged, (req, res) => {
    if (!req.body.password) {
        res.render("register", {
            error: true
        });
    } else {
        hash(req.body.password).then(hash => {
            addRegister(req.body.first, req.body.last, req.body.email, hash)
                .then(data => {
                    req.session.user = {
                        name: data[0].first,
                        user_id: data[0].id,
                        canAddInfo: true
                    };

                    res.redirect("/profiles");
                })
                .catch(error => {
                    console.log(error);
                    res.render("register", {
                        error: true
                    });
                });
        });
    }
});

router.get("/profiles", isNotLogged, canAddInfo, (req, res) => {
    res.render("profiles", {
        logoutBtn: true,
        name: req.session.user.name,
        layout: "main"
    });
});

router.post("/profiles", isNotLogged, canAddInfo, (req, res) => {
    let url = checkUrl(req.body.url);
    addData(req.body.age, req.body.city, url, req.session.user.user_id)
        .then(() => {
            req.session.user.canAddInfo = false;
            res.redirect("/petition");
        })
        .catch(error => {
            console.log(error);
            res.render("profiles", {
                error: true
            });
        });
});

router.get("/edit", isNotLogged, (req, res) => {
    getEditData(req.session.user.user_id)
        .then(data => {
            res.render("edit", {
                first: data[0].first,
                last: data[0].last,
                email: data[0].email,
                age: data[0].age,
                url: data[0].url,
                city: data[0].city,
                logoutBtn: true,
                name: req.session.user.name,
                layout: "main"
            });
        })
        .catch(error => {
            console.log(error);
            req.session.user.canAddInfo = true;
            res.redirect("/profiles");
        });
});

router.post("/edit", isNotLogged, (req, res) => {
    let url = checkUrl(req.body.url);
    if (req.body.age == "") {
        req.body.age = null;
    }
    if (req.body.password) {
        hash(req.body.password).then(hash => {
            Promise.all([
                updateUserDataPass(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hash,
                    req.session.user.user_id
                ),
                updateProfiles(
                    req.body.age,
                    req.body.city,
                    url,
                    req.session.user.user_id
                )
            ])
                .then(function() {
                    req.session.user.name = req.body.first;
                    res.redirect("/thankyou");
                })
                .catch(error => {
                    console.log(
                        "At least one of my promises was rejected :(",
                        error
                    );
                    getEditData(req.session.user.user_id).then(data => {
                        res.render("edit", {
                            first: data[0].first,
                            last: data[0].last,
                            email: data[0].email,
                            age: data[0].age,
                            url: data[0].url,
                            city: data[0].city,
                            logoutBtn: true,
                            name: req.session.user.name,
                            error: true,
                            layout: "main"
                        });
                    });
                });
        });
    } else {
        Promise.all([
            updateUserDataNoPass(
                req.body.first,
                req.body.last,
                req.body.email,
                req.session.user.user_id
            ),
            updateProfiles(
                req.body.age,
                req.body.city,
                url,
                req.session.user.user_id
            )
        ])
            .then(() => {
                req.session.user.name = req.body.first;
                res.redirect("/thankyou");
            })
            .catch(error => {
                console.log(
                    "At least one of my promises was rejected :(",
                    error
                );
                getEditData(req.session.user.user_id).then(data => {
                    res.render("edit", {
                        first: data[0].first,
                        last: data[0].last,
                        email: data[0].email,
                        age: data[0].age,
                        url: data[0].url,
                        city: data[0].city,
                        logoutBtn: true,
                        error: true,
                        name: req.session.user.name,
                        layout: "main"
                    });
                });
            });
    }
});
