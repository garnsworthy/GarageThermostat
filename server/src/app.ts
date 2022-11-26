import express from "express";

const port = 3000;
const embeddedPort = 8085;

const data = {
  setpoint: 1100,
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
  data.setpoint = req.body.setpoint;
  data.heat = req.body.heat;
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
embeddedApp.use(express.json());

embeddedApp.post("*", (req, res) => {
  console.log(req.body);
  data.temp = req.body.temp;
  data.humidity = req.body.hum;
  data.heating = req.body.heating;
  res.send(JSON.stringify({ setpoint: data.setpoint, heat: data.heat }));
});

embeddedApp.listen(embeddedPort, () => {
  return console.log(`Embedded Express is listening at http://localhost:${embeddedPort}`);
});
