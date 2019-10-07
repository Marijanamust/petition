const express = require("express");
const router = (exports.router = express.Router());
const { isLogged } = require("../utils/permissions");
const { compare } = require("../utils/bc");
const { getSignature, getHash } = require("../utils/db.js");

router.get("/login", isLogged, (req, res) => {
    res.render("login", {
        layout: "main"
    });
});

router.post("/login", (req, res) => {
    getHash(req.body.email)
        .then(data => {
            compare(req.body.password, data.password).then(match => {
                if (match) {
                    req.session.user = {
                        user_id: data.id,
                        name: data.first
                    };

                    getSignature(req.session.user.user_id)
                        .then(data => {
                            req.session.signatureId = data[0].id;
                            res.redirect("/thankyou");
                        })
                        .catch(error => {
                            console.log(error);
                            res.redirect("/petition");
                        });
                } else {
                    res.render("login", {
                        error: true
                    });
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.render("login", {
                error: true
            });
        });
});

router.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register");
});
