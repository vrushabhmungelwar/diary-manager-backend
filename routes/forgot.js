import express from "express";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getUserByEmail,
  genPassword,
  createToken,
  getUserById,
  getToken,
  RemoveTokenById,
  updateUserPassById,
} from "../helper.js";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

router.route("/").post(async (request, response) => {
  const { email } = request.body;
  const userFromDB = await getUserByEmail(email);
  if (!userFromDB) {
    response.status(401).send({ message: "No User with this Email" });
    return;
  } else {
    const secret = process.env.SECRET_KEY + userFromDB.password;
    const payload = {
      email: userFromDB.email,
      id: userFromDB._id,
    };

    const jwtToken = jwt.sign(payload, secret, { expiresIn: "15m" });

    const token = {
      userId: userFromDB._id,
      token: jwtToken,
    };
    createToken(token);

    const message = `${process.env.BASE_URL2}forgotPassword/resetpassword/${userFromDB._id}/${token.token}`;
    await sendEmail(email, "Verify Email", message);

    response.send({
      message: "An Email sent to your account please verify",
      token: jwtToken,
      id: userFromDB._id,
      success: true,
    });
  }
});

router.route("/resetpassword/:id/:token").get(async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(400).send("Invalid link");
    const token = await getToken(user._id, req.params.token);
    if (!token) return res.status(400).send("Invalid link");

    res.writeHead(301, { Location: "https://gifted-sinoussi-8c14db.netlify.app/#/resetpassword" });
    res.end();
  } catch (error) {
    res.status(400).send("An error occured");
  }
});

router.route("/resetpassword/:id/:token").post(async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(400).send("user not in database");
    const token = await getToken(user._id, req.params.token);
    const secret = process.env.SECRET_KEY + user.password;
    const payload = jwt.verify(req.params.token, secret);

    if (payload) {
      const hashedPassword = await genPassword(req.body.password);
      // console.log(hashedPassword);
      await updateUserPassById(req.params.id, hashedPassword);
      await RemoveTokenById(token._id);
      res.send({ success: true, message: "successfull" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export const forgot = router;
