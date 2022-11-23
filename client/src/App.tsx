import { Box, Grid, Slider, Typography } from "@mui/material";
import { useState } from "react";
import { HomeAppBar } from "./components";
import { useInterval } from "./utils";

function App() {
  const [fromHeater, setFromHeater] = useState({
    temp: 11,
    humidity: 35,
    heating: false,
  });
  const [setpoint, setSetpoint] = useState(12);
  const [heat, setHeat] = useState(false);
  const [unitSI, setUnitSI] = useState(false);
  const formatVal = (v: number, p?: number) => {
    return unitSI ? `${v} °C` : `${((9 / 5) * v + 32).toFixed(p || 0)} °F`;
  };

  // go to the server once a minute to update and get data.
  useInterval(async () => {
    const res = await fetch("/data", {
      method: "POST",
      body: JSON.stringify({ setpoint: setpoint, heat: heat }),
    });
    const json = await res.json();
    setFromHeater(json);
  }, 60000);

  return (
    <div>
      <HomeAppBar
        heat={heat}
        setHeat={setHeat}
        unitSI={unitSI}
        setUnitSI={setUnitSI}
      />

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Box sx={{ width: 300, margin: "auto" }}>
            <Slider
              value={setpoint}
              onChange={(e, v) => setSetpoint(v as number)}
              min={3}
              max={16}
              getAriaValueText={formatVal}
              valueLabelFormat={formatVal}
            ></Slider>
          </Box>
        </Grid>

        <Grid item xs={12} textAlign={"center"}>
          <Typography variant={"h3"}>{formatVal(setpoint)}</Typography>
          <Typography variant={"caption"}>Setpoint</Typography>
        </Grid>

        <Grid container item xs={12} textAlign={"center"}>
          <Grid item xs={6}>
            <Typography variant={"h6"}>{formatVal(fromHeater.temp, 2)}</Typography>
            <Typography variant={"caption"}>Temperature</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant={"h6"}>{`${fromHeater.humidity}%`}</Typography>
            <Typography variant={"caption"}>Humidity</Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
