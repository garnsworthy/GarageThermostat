import * as React from "react";
import { Switch as MuiSwitch, Typography, Grid } from "@mui/material";

/**
 * Component Ant Switch: A basic Switch input component from @mui/material,
 * customized to give the users a visual of switching between two states
 * represented by the two labels that encloses the switch in the UI. Can be embedded
 * in a form, table or anywhere in a React page that needs and supports the implementation.
 *
 * Note: This switch works with the binary states, *true* and *false* that is
 *       taken by the "checked" prop. Switch will always be toggled to the *right*
 *       when "checked" is set to true and to the *left* otherwise. It is highly
 *       recommended to place the "lefttext" and "righttext" labels accordingly.
 * Usage:
 *   <AntSwitch
 *     name={"UniqueName"}>
 *     checked={true}
 *     onChange={(evt: React.ChangeEvent<HTMLInputElement>,
 *                checked: boolean)=>{
 *                  data[id].checked=checked;
 *                  setData(data);
 *                }
 *              }
 *      lefttext={"OFF"}
 *      righttext={"ON"}
 *   </AntSwitch>
 */
interface AntSwitchProps {
  name: string;
  checked: boolean | undefined;
  onChange: (
    evt: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  lefttext: string;
  righttext: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
}

export function AntSwitch(props: AntSwitchProps) {
  return (
    <Typography component="div">
      <Grid component="label" container alignItems="center" spacing={1}>
        <Grid id={`left-label-${props.name}`} item>
          {props.lefttext}
        </Grid>
        <Grid item>
          <MuiSwitch
            {...props}
            // name is used as id here
            id={props.name}
            name={props.name}
            checked={props.checked}
            onChange={props.onChange}
          />
        </Grid>
        <Grid id={`right-label-${props.name}`} item>
          {props.righttext}
        </Grid>
      </Grid>
    </Typography>
  );
}
