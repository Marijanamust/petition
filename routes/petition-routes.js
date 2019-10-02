const express = require("express");
const router = (exports.router = express.Router());
const {
    hasSigned,
    isNotLogged,
    hasNotSigned
} = require("../utils/permissions");
const {
    getSigners,
    addSigner,
    getSignature,
    deleteSignature,
    getNumber,

    getCitySigners
} = require("../utils/db.js");

// const { checkUrl } = require("../utils/repetitive");

router.get("/", (req, res) => {
    res.redirect("/register");
});

router.get("/petition", isNotLogged, hasSigned, (req, res) => {
    res.render("welcome", {
        layout: "main",
        logoutBtn: true,
        error: false,
        name: req.session.user.name
    });
});

router.post("/petition", isNotLogged, hasSigned, (req, res) => {
    // console.log("signature and id", req.session.user.user_id);
    addSigner(req.body.signature, req.session.user.user_id)
        .then(id => {
            req.session.signatureId = id;
            res.redirect("/thankyou");
        })
        .catch(error => {
            console.log(error);
            res.render("welcome", {
                error: true
            });
        });
});

router.get("/thankyou", hasNotSigned, isNotLogged, (req, res) => {
    // console.log(req.session.user);
    getSignature(req.session.user.user_id)
        .then(sig => {
            getNumber().then(count => {
                res.render("thankyou", {
                    sig: sig[0].signature,
                    name: req.session.user.name,
                    count: count,
                    layout: "main",
                    logoutBtn: true
                });
            });
        })
        .catch(error => {
            console.log(error);
        });
});

router.post("/thankyou", hasNotSigned, (req, res) => {
    // console.log("My user ID", req.session.user.user_id);
    deleteSignature(req.session.user.user_id)
        .then(() => {
            // console.log("ITs OK", req.session.user.user_id),
            req.session.signatureId = null;
            res.redirect("/petition");
        })
        .catch(error => {
            console.log("its not ok to delete signature", error);
        });
});

router.get("/signers", isNotLogged, hasNotSigned, (req, res) => {
    getSigners()
        .then(results => {
            res.render("signers", {
                signers: results,
                layout: "main",
                logoutBtn: true,
                name: req.session.user.name
            });
        })
        .catch(error => {
            console.log(error);
        });
});

router.get("/signers/:city", isNotLogged, hasNotSigned, (req, res) => {
    getCitySigners(req.params.city)
        .then(results => {
            if (results.length === 0) {
                res.render("cities", {
                    city: req.params.city,
                    nosigners: true,
                    name: req.session.user.name,
                    layout: "main",
                    logoutBtn: true
                });
            } else {
                res.render("cities", {
                    city: req.params.city,
                    signers: results,
                    name: req.session.user.name,
                    layout: "main",
                    logoutBtn: true
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
});
