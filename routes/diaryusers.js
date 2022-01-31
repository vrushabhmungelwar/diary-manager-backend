import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  getUserByEmail,
  genPassword,
  createToken,
  getUserById,
  getToken,
  updateUserById,
  RemoveTokenById,
} from "../helper.js";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

router.route("/signup").post(async (request, response) => {
  let success = false;
  const { name, email, password } = request.body;
  const userFromDB = await getUserByEmail(email);
  console.log(userFromDB);

  if (userFromDB) {
    success = false;
    response.status(400).send({ success, message: "email already exists" });
    return;
  }

  success = true;
  const hashedPassword = await genPassword(password);
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    verified: false,
  });
  const user1 = await getUserByEmail(email);
  const token = {
    userId: user1._id,
    token: jwt.sign({ id: user._id }, process.env.SECRET_KEY),
  };
  createToken(token);
  const message = `${process.env.BASE_URL}verify/${user1._id}/${token.token}`;
  await sendEmail(email, "Verify Email", message);
  response.send({
    message: "An Email sent to your account please verify",
    success: success,
  });
});

router.route("/verify/:id/:token").get(async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(400).send("Invalid link");
    const token = await getToken(user._id, req.params.token);
    if (!token) return res.status(400).send("Invalid link");

    await updateUserById({ id: user._id, verified: true });
    await RemoveTokenById(token._id);
    res.send("email verified sucessfully");
  } catch (error) {
    res.status(400).send("Error");
  }
});

router.route("/login").post(async (request, response) => {
  let success = false;
  const { email, password } = request.body;

  const userFromDB = await getUserByEmail(email);
  if (!userFromDB) {
    success = false;
    response.status(401).send({ success, message: "Invalid credentials1" });
    return;
  }
  if (userFromDB.verified === false) {
    success = false;
    response.send({ success, message: "please verify your email" });
    return;
  }
  const storedPassword = userFromDB.password;

  const isPasswordMatch = await bcrypt.compare(password, storedPassword);

  if (isPasswordMatch) {
    const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    success = true;
    response.send({ success, message: "Successful login", token: token });
    // console.log(userFromDB);
  } else {
    success = false;
    response.status(401).send({ success, message: "Invalid credentials" });
  }
});

export const userRouter = router;
