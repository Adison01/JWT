const router = require("express").Router();
const { publicPosts, privatePosts } = require("../db");
const checkAuth = require("../middleware/checkAuth");

router.get("/public", (req, res) => {
  res.json(publicPosts);
});

//using middleware in between get call
router.get(
  "/private",
  checkAuth,
  //   (req, res, next) => {
  //     let userValid = true;
  //     if (userValid) {
  //       next();
  //     } else {
  //       return res.status(400).json({
  //         errors: [
  //           {
  //             msg: "Access denied",
  //           },
  //         ],
  //       });
  //     }
  //   },
  (req, res) => {
    res.json(privatePosts);
  }
);
module.exports = router;
