import express from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import todoRoutes from "./routes/todos.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.urlencoded({ urlencoded: true }));

app.use("/todos", todoRoutes);

app.get("/json-test", (req, res) => {
  res.send({
    message: "json test ok",
  });
});

app.listen(3009, () => {
  console.log("server is connected at port 3009");
});
