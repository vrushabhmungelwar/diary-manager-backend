import { client } from "./index.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

async function createUser(data) {
  return await client.db("Diary_Database").collection("user").insertOne(data);
}
async function createToken(data) {
  return await client.db("Diary_Database").collection("tokens").insertOne(data);
}
async function getUserByEmail(email) {
  return await client
    .db("Diary_Database")
    .collection("user")
    .findOne({ email: email });
}
async function getUserById(id) {
  return await client
    .db("Diary_Database")
    .collection("user")
    .findOne({ _id: ObjectId(id) });
}
async function getToken(id, token) {
  return await client.db("Diary_Database").collection("tokens").findOne({
    userId: id,
    token: token,
  });
}
async function RemoveTokenById(id) {
  return await client
    .db("Diary_Database")
    .collection("tokens")
    .deleteOne({ _id: ObjectId(id) });
}

async function updateUserById({ id, verified }) {
  return await client
    .db("Diary_Database")
    .collection("user")
    .updateOne({ _id: ObjectId(id) }, { $set: { verified: verified } });
}

async function updateUserPassById(id, hashedpassword) {
  return await client
    .db("Diary_Database")
    .collection("user")
    .updateOne({ _id: ObjectId(id) }, { $set: { password: hashedpassword } });
}

async function genPassword(password) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export {
  createUser,
  getUserByEmail,
  genPassword,
  createToken,
  getUserById,
  getToken,
  updateUserById,
  RemoveTokenById,
  updateUserPassById,
};
