const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = process.env.JWT_SECRET ;

// /Route 1
// /Creat user using :POST "api/auth/createuser". Doesnt require Authentication
router.post(
  "/createuser",
  [
    // validation by express validator
    body("name", "Enter a valid name").isLength({ min: 4 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must b 5 characters long or more").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    // /If there are error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    ///Check whether user with this email exits already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }
      /// password encryption
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      /// create anew user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      // 
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken });
    } catch (error) {
      ///catch error
      console.log(error.message);
      res.status(500).json({error:"Internal Server Error"});
    }
  }
);

// /Route 2
// /Authenticate a user with: POST "/api/auth/login". no login required

router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Please try to login with correct credentials" });
      }
      // /compare password
      const passwordCompare = await bcrypt.compare(password, user.password);
      // /if password is incorrect
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

///Route 3 Get loggedin User details using:POST "/api/auth/getuser". Login required
router.post("/getuser", /*Middle ware*/ fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
