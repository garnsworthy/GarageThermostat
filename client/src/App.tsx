
import { Box, Grid, Slider, Typography } from "@mui/material";
import { useState } from "react";

function App() {
  const formatVal = (v: number) => `${v} °C`;
  const [setpoint, setSetpoint] = useState(55);
  const [temp, setTemp] = useState(44);
  const [humidity, setHumidity] = useState(35);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <Box sx={{ width: 300, margin: "auto" }}>
          <Slider
            value={setpoint}
            onChange={(e, v) => setSetpoint(v as number)}
            min={40}
            max={60}
            step={1}
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
          <Typography variant={"h6"}>{formatVal(temp)}</Typography>
          <Typography variant={"caption"}>Temperature</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant={"h6"}>{`${humidity}%`}</Typography>
          <Typography variant={"caption"}>Humidity</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
