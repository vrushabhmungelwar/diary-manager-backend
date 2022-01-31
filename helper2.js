import { client } from "./index.js";

async function createUserData(data) {
  return await client
    .db("Diary_Database")
    .collection("usersDiary")
    .insertOne(data);
}

async function getEventByUserId(id) {
  return await client
    .db("Diary_Database")
    .collection("usersDiary")
    .findOne({ userId: id });
}

async function updateUsersDataById(userId, data) {
  return await client
    .db("Diary_Database")
    .collection("usersDiary")
    .updateOne({ userId: userId }, { $set: { events: data } });
}

async function createUserDiary(data) {
  return await client.db("Diary_Database").collection("Diary").insertOne(data);
}
async function getDiaryByUserId(id) {
  return await client
    .db("Diary_Database")
    .collection("Diary")
    .findOne({ userId: id });
}

async function updateUsersDiaryById(userId, data) {
  return await client
    .db("Diary_Database")
    .collection("Diary")
    .updateOne({ userId: userId }, { $set: { diary: data } });
}

export {
  createUserData,
  getEventByUserId,
  updateUsersDataById,
  createUserDiary,
  getDiaryByUserId,
  updateUsersDiaryById,
};
