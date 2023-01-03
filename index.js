const routes = require("./routes/routes");
const express = require("express");
const {v4:uuidv4} = require("uuid");
const session = require("express-session");
const cookies = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.set("view engine", "ejs");

app.use(
  session({
    secret:uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/",routes)

// app.use(cookies());

// let data=fs.readFileSync(filpath+"/index.html",{encoding:"utf-8",flag:"r"})
// console.log(data)

// app.post("/form_submit", (req, res) => {
//   console.log(req.body);
//   res.send(req.body);
// });
// app.get("/sess", (req, res) => {
//   res.send({ session: req.cookies });
// });
// app.get("/logout", (req, res) => {
//   res.clearCookie("data");
//   res.send({ session: req.cookies });
// });

app.listen(3000, () => {
  console.log("server stated at port:3000");
});



// db.end()