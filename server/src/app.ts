import express from "express";
const fs = require("fs");

Number.prototype["pad"] = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

const port = 3000;
const embeddedPort = 8085;

const data = {
  setpoint: 1100,
  heat: false,
  temp: 15,
  humidity: 55,
  heating: false,
  id: "---",
};

/**
 * Listen for browsers
 */
const app = express();
app.use(express.json());
// serve static files from client.
app.use(express.static("../client/build"));
app.post("/data", (req, res) => {
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
app.get("/data", (req, res) => {
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

embeddedApp.post("/data", (req, res) => {
  // data received from device
  data.temp = req.body.temp;
  data.humidity = req.body.hum;
  data.heating = req.body.heating;
  data.id = req.body.id;

  //data to send to device.
  res.send(JSON.stringify({ setpoint: data.setpoint, heat: data.heat }));
  recordData();
});

embeddedApp.listen(embeddedPort, () => {
  return console.log(
    `Embedded Express is listening at http://localhost:${embeddedPort}`
  );
});

/**
 * record data to disk
 * mac address - year - month
 * 30AEA4070D64-2022-12
 */
const recordData = () => {
  const date = new Date();
  const content = `{s:${data.setpoint}, h:${data.heat}, t:${data.temp}, h:${
    data.humidity
  }, t:$${date.getTime()}}`;
  // @ts-ignore we added it above
  const fileName = `${data.id.split(":").join("")}-${date.getUTCFullYear()}-${date.getUTCMonth().pad(2)}.data`;

  fs.appendFile(fileName, content, (err) => {
    if (err) {
      console.error(err);
    }
    // done!
  });
};
