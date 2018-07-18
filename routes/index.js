var express = require('express');
var router = express.Router();
const db = require("./../db.js");

var bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Registration' });
});

router.post("/register", (req, res, next) => {
  const { body: { username, email, password } } = req;
  
  // express validator
  req.checkBody('username', 'Username field cannot be empty.').notEmpty();
  req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
  req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
  req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
  req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
  req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
  req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
  req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(password);

  // Additional validation to ensure username is alphanumeric with underscores and dashes
  req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

  const validateErrors = req.validationErrors();

  if (validateErrors) {
    // // console.log("Validate Errors", validateErrors);
    // const errorMessages = validateErrors.map(validateError => {
    //   return  validateError.msg + "<br/>";
    // }).join("");
    
    // res.render("register", { title: errorMessages });

    res.render("register", {
      title: "Registration Error",
      errors: validateErrors
    })
    return;    
  }

  // Encryption
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if(err) throw err;

    const queryString = "INSERT INTO users SET ?;";
    const mode = { username, email, password: hash };
    db.query(queryString, mode, (err, data, fields) => {
      if (err) {
        console.log("Error Code", err.code);
        console.log("Sql Message", err.sqlMessage);
        res.render("register", { title: "Registration Error" });
        return;
      }
      
      res.render("register", { title: "Registration Complete" })
      
    });
  });
})

module.exports = router;
