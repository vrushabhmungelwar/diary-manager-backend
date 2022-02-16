import express from "express";
import {
  createUserDiary,
  getDiaryByUserId,
  updateUsersDiaryById,
} from "../helper2.js";

const router = express.Router();

router.route("/").post(async (request, response) => {
  try {
    const { userId, diarydata } = request.body;
    const usersdata = await getDiaryByUserId(userId);
    const current = new Date();
    const fdate = `${current.getDate()}-${
      current.getMonth() + 1
    }-${current.getFullYear()}`;
    if (!usersdata) {
      const diary = [];
      diary.push({
        diary: diarydata,
        date: fdate,
      });
      await createUserDiary({
        userId,
        diary,
      });
      response.send({ success: true, message: "successfull" });
      return;
    }
    const temp = usersdata.diary.filter((item) => item.date === fdate);

    if (temp.length > 0) {
      response.send({
        success: false,
        message: "you already added todays diary record",
      });
      return;
    }
    const newdiary = {
      diary: diarydata,
      date: fdate,
    };
    const data = usersdata.diary;
    data.push(newdiary);
    await updateUsersDiaryById(userId, data);
    response.send({ success: true, message: "successfully added" });
  } catch (error) {
    response.send(error.message);
  }
});

router.route("/:id").get(async (request, response) => {
  try {
    const userId = request.params.id;
    const usersdata = await getDiaryByUserId(userId);
    console.log(usersdata);
    response.send(usersdata);
  } catch (error) {
    response.send(error.message);
  }
});

export const diaryRouter = router;
