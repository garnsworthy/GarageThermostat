import express from "express";

const app = express();
const port = 3000;

app.use(express.json());
// serve static files from client.
app.use(express.static("../client/build"));

app.post("/data", (req, res) => {
  console.log(req.body);
  res.send(JSON.stringify({ temp: 15, humidity: 55, heating: true }));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
