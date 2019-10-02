// const supertest = require("supertest");
// const { app } = require("./index");
// // we are requiring the cookie session mock not the npm package cookie session
// // jest knows to look in mocks
// const cookieSession = require("cookie-session");
//
// test("GET/welcome when fakeCookieForDemo cookie is sent, receives p tag as response", () => {
//     // whatever i put into mocksessiononce will be whats attached to req.session
//     // so here we send a cookie called fakeCookieForDemo as part of the request and in index.js fakeCookieForDemo will be attached to req.session
//     cookieSession.mockSessionOnce({
//         fakeCookieForDemo: true
//     });
//
//     return supertest(app)
//         .get("/welcome")
//         .then(res => {
//             expect(res.statusCode).toBe(200);
//             expect(res.text).toBe("<h1>youkgkijöpkljhgfdghjklö");
//         });
// });
//
// test("GET /home returns 200 status code", () => {
//     // making a http request to our server and then shows response
//     return supertest(app)
//         .get("/home")
//         .then(res => {
//             expect(res.statusCode).toBe(200);
//         });
// });
//
// test("GET /welcome causes redirect", () => {
//     // making a http request to our server and then shows response
//     return supertest(app)
//         .get("/welcome")
//         .then(res => {
//             console.log("res:", res);
//             // we expect to be redirected so status code
//             expect(res.statusCode).toBe(302);
//             expect(res.headers.location).toBe("/home");
//         });
// });
//
// test("POST /welcome sets 'wentTowelcome' cookie", () => {
//     // 1. cookie variable will store any information thats written to a cookies by the POST /welcome route in index.js
//     const cookie = {};
//     // 2.tell cookieSession mock that it should treat my cookie variable as req.session (my cookie). Meaning that any info that index.js writes to a cookie should eb written to my "cookie variable"
//     cookieSession.mockSessionOnce(cookie);
//     // 3. make POST /welcome request to server using supertest
//     return supertest(app)
//         .post("/welcome")
//         .then(res => {
//             // 4. down here if we log cookie we asee that data was written to it. when the server does re.session.something=someVal that key-value pair gets stored in our cookie variable
//             // console.log("res: ", res);
//             // console.log("cookie: ", cookie);
//             expect(res.statusCode).toBe(302);
//             expect(res.headers.location).toBe("/home");
//             expect(cookie).toEqual({
//                 wentToWelcome: "yeap"
//             });
//         });
// });
