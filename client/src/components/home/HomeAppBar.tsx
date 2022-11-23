import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { AntSwitch } from "../AntSwitch";
import { useRef, useState } from "react";

interface Props {
  heat: boolean;
  setHeat: (f: boolean) => void;
  unitSI: boolean;
  setUnitSI: (f: boolean) => void;
}

export function HomeAppBar(props: Props) {
  const { heat, setHeat, unitSI, setUnitSI } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const ref = useRef();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            ref={ref.current}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem>
              <AntSwitch
                name="heat"
                checked={unitSI}
                lefttext="°F"
                righttext="°C"
                onChange={(e, f) => setUnitSI(f)}
              ></AntSwitch>
            </MenuItem>
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Garage Heater
          </Typography>
          <AntSwitch
            color="warning"
            name="heat"
            checked={heat}
            lefttext="Off"
            righttext="Heat"
            onChange={(e, f) => setHeat(f)}
          ></AntSwitch>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
