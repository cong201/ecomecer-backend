const express = require("express");
const User = require("./user.modal");
const generateToken = require("../middleware/generateToken");
const router = express.Router();

//Register endpoint
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username, password });
    await user.save();
    res.status(201).send({ message: "User registed successfully!" });
  } catch (error) {
    console.log("errror", error);
    res.status(500).send({ message: "Error registering user" });
  }
});

//login user endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Password not match" });
    }
    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    //RESPONE IN POSTMAN
    res.status(200).send({
      message: "Loggin successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession,
      },
    });
  } catch (error) {
    console.log("Error login in user", error);
    res.status(500).send({ message: "Error login in user" });
  }
});

//logut endpoint
router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logout successfully!" });
});

//delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user", error);
    res.status(500).send({ message: "Error deleting user" });
  }
});

module.exports = router;
