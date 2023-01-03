const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "test",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("connected as id " + db.threadId);
});

const login = function (req, res) {
  try {
    if (req.body) {
      const { email, password } = req.body;
      let sql = `select * from login WHERE email='${email}'`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log("lalan");
          console.log(err);
          res.redirect("/");
        } else if (result.length > 0) {
          if (result[0].password === password) {
            if (result[0].isLock) {
              let time = (Date.now() - result[0].lockedAt) / 1000;
              if (time < 86400) {
                req.session.message = "locked";
                res.redirect("/");
              } else {
                let sql = `update login set isLock=false, lockedAt=${Date.now()} WHERE email='${email}'`;
                db.query(sql, (err, result) => {
                  if (err) {
                    console.log("lalan");
                    console.log(err);
                    res.redirect("/");
                  }
                });
                req.session.user = result[0].email;
                req.session.message = "logged";
                res.redirect("/dashboard");
              }
            } else {
              req.session.user = result[0].email;
              req.session.message = "logged";
              res.redirect("/dashboard");
            }
          } else {
            if (req.session.count) {
              if (req.session.count <= 3) {
                req.session.count += 1;
                res.redirect("/");
              } else {
                req.session.count = 0;
                let sql = `update login set isLock=true, lockedAt=${Date.now()} WHERE email='${email}'`;
                db.query(sql, (err, result) => {
                  if (err) {
                    console.log("lalan");
                    console.log(err);
                    res.redirect("/");
                  }
                });
                console.log(sql);
                req.session.message = "locked";
                res.redirect("/");
              }
            } else {
              req.session.count = 1;
              res.redirect("/");
            }
            // console.log(req.session.count);
            // console.log(Date.now());
          }
          //   res.redirect("/dashboard");
        } else {
          console.log("lalan1");
          req.session.message = "invalid";
          res.redirect("/");
        }
      });
    } else {
      req.session.message = "";
      res.redirect("/");
    }
  } catch (err) {
    return res.status(500).send({ meg: err.message });
  }
  // console.log(email,password)
};

module.exports = {
  login,
};
