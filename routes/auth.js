const router = require("express").Router();
const { check, validationResult } = require("express-validator"); // please google express-validator to see how it works
const { users } = require("../db");
//bcrypt is for hashing password
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.post(
  "/signup",
  [
    check("email", "please provide valid email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    //validated the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //validate if user does not already exist.
    let user = users.find((user) => {
      return (user.email = email);
    });
    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: "user already exist",
          },
        ],
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    console.log(hashedPassword);

    const token = await JWT.sign({ email }, "my secret", {
      expiresIn: 1000000,
    });

    res.json({ token });
  }
);

router.post("/login", async (req, res) => {
  const { password, email } = req.body;
  let user = users.find((user) => {
    return user.email === email;
  });
  if (!user) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid credentials",
        },
      ],
    });
  }
  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid credentials",
        },
      ],
    });
  }

  const token = await JWT.sign({ email }, "my secret", {
    expiresIn: 1000000,
  });

  res.json({ token });
});

router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;
