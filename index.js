import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createConnection } from "./connection.js";
import { userRouter } from "./routes/diaryusers.js";
import { forgot } from "./routes/forgot.js";
import { eventRouter } from "./routes/events.js";
import { diaryRouter } from "./routes/diary.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
export const client = await createConnection();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/user", userRouter);
app.use("/forgotPassword", forgot);
app.use("/event", eventRouter);
app.use("/diary", diaryRouter);




app.listen(process.env.PORT || 8000, () =>
  console.log(`Listening on port 8000...`)
);
