import express from "express";
import {
  createUserData,
  getEventByUserId,
  updateUsersDataById,
} from "../helper2.js";
const router = express.Router();

router.route("/").post(async (request, response) => {
  try {
    const { userId, eventname, eventdata, date, fdate } = request.body;
    const usersdata = await getEventByUserId(userId);
    if (!usersdata) {
      const events = [];
      events.push({
        eventname: eventname,
        eventdata: eventdata,
        date: date,
        fdate: fdate,
      });
      await createUserData({
        userId,
        events,
      });
      response.send({ success: true, message: "successfull" });
      return;
    }
    const newevent = {
      eventname: eventname,
      eventdata: eventdata,
      date: date,
      fdate: fdate,
    };
    const data = usersdata.events;
    data.push(newevent);
    await updateUsersDataById(userId, data);
    response.send({ success: true, message: "successfully added" });
  } catch (error) {
    response.send(error.message);
  }
});

router.route("/:id").get(async (request, response) => {
  try {
    const userId = request.params.id;
    const usersdata = await getEventByUserId(userId);
    console.log(usersdata);
    response.send(usersdata);
  } catch (error) {
    response.send(error.message);
  }
});

router.route("/save").post(async (request, response) => {
  try {
    const { userId, events } = request.body;
    await updateUsersDataById(userId, events);
    response.send({ success: true, message: "successfully added" });
  } catch (error) {
    response.send(error.message);
  }
});

export const eventRouter = router;
