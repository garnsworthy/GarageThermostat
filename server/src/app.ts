import express from "express";

const port = 3000;
const embeddedPort = 8085;

const data = {
  setpoint: 0,
  heat: false,
  temp: 15,
  humidity: 55,
  heating: false,
};

/**
 * Listen for browsers
 */
const app = express();
app.use(express.json());
// serve static files from client.
app.use(express.static("../client/build"));
app.post("/data", (req, res) => {
  console.log(req.body);
  res.send(
    JSON.stringify({
      temp: data.temp,
      humidity: data.humidity,
      heating: data.heating,
    })
  );
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

/**
 * Listen for updates from the heater controller.
 * Reply with the setpt and fHeat.
 */
const embeddedApp = express();
app.use(express.json());

app.post("/data", (req, res) => {
  console.log(req.body);
  res.send(JSON.stringify({ setpoint: data.setpoint, heat: data.heat }));
});

app.listen(embeddedPort, () => {
  return console.log(`Embedded Express is listening at http://localhost:${port}`);
});
