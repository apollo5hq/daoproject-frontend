import { useState } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import {
  Stack,
  Toolbar,
  Tooltip,
  Fade,
  Drawer as MuiDrawer,
  IconButton,
} from "@mui/material";
import { Color, ColorResult, HuePicker } from "react-color";
import { CanvasTools } from "@/components";
import { Tools } from "src/utils/types/canvas";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import UndoIcon from "@mui/icons-material/Undo";
import ClearAllIcon from "@mui/icons-material/ClearAll";

const drawerWidth = 400;

const openedMixin = (theme: Theme): CSSObject => ({
  height: drawerWidth,
  transition: theme.transitions.create("height", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowY: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("height", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowY: "hidden",
  height: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    height: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  height: drawerWidth,
  position: "absolute",
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function (props: Tools) {
  const {
    canvasContext,
    setPainterState,
    isErasing,
    lineWidth,
    canvasRef,
    restoreState,
    setRestoreState,
  } = props;
  const [open, setOpen] = useState(false);
  const {
    palette: { primary },
  } = useTheme();
  const handleDrawer = () => {
    setOpen(!open);
  };

  // State for color picker
  const [colorPickerState, setColorPickerState] = useState<Color>(primary.main);
  // Sets color of the pencil and changes the color of the picker
  const onChangeComplete = (value: ColorResult) => {
    setPainterState((prevState) => {
      return { ...prevState, userStrokeStyle: value.hex };
    });
    setColorPickerState(value.rgb);
  };

  return (
    <Drawer variant="permanent" anchor="bottom" open={open}>
      <Toolbar>
        <Fade in={!open}>
          <Stack
            sx={{ flexGrow: 1, alignItems: "center" }}
            direction="row"
            alignItems="flex-start"
            justifyContent="center"
            spacing={3}
          >
            <HuePicker
              width="200px"
              color={colorPickerState}
              onChangeComplete={onChangeComplete}
            />
            <Tooltip title="Pen">
              <IconButton>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Undo">
              <IconButton>
                <UndoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear canvas">
              <IconButton>
                <ClearAllIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Fade>
        <Tooltip title={open ? "Close drawer" : "Open drawer"}>
          <IconButton onClick={handleDrawer}>
            {open ? (
              <KeyboardDoubleArrowDownIcon />
            ) : (
              <KeyboardDoubleArrowUpIcon />
            )}
          </IconButton>
        </Tooltip>
      </Toolbar>
      <div style={{ paddingTop: 10 }}>
        <Fade in={open}>
          <Toolbar sx={{ alignItems: "center", justifyContent: "center" }}>
            <CanvasTools
              setPainterState={setPainterState}
              canvasContext={canvasContext}
              isErasing={isErasing}
              lineWidth={lineWidth}
              canvasRef={canvasRef}
              restoreState={restoreState}
              setRestoreState={setRestoreState}
              onChangeComplete={onChangeComplete}
              colorPickerState={colorPickerState}
            />
          </Toolbar>
        </Fade>
      </div>
    </Drawer>
  );
}
