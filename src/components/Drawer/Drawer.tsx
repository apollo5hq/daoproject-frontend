import { useState, RefObject, Dispatch, SetStateAction } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import { RestoreState, Tools } from "src/utils/types/canvas";
import { Color, ColorResult, HuePicker } from "react-color";
import { CanvasTools } from "@/components";
import { mdiEraserVariant } from "@mdi/js";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import UndoIcon from "@mui/icons-material/Undo";
import ClearAllIcon from "@mui/icons-material/ClearAll";

interface DrawerProps extends Tools {
  canvasRef: RefObject<HTMLCanvasElement>;
  restoreState: RestoreState;
  setRestoreState: Dispatch<SetStateAction<RestoreState>>;
}

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

export default function (props: DrawerProps) {
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

  // State for undoing last draw
  const { index: restoreIndex } = restoreState;

  // Clear the entire canvas
  const clearCanvas = () => {
    if (!canvasContext || !canvasRef.current) return;
    canvasContext.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    canvasContext.globalCompositeOperation = "source-over";
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    // Need to reset the restore state as well
    setRestoreState(() => {
      return { array: [], index: -1 };
    });
  };

  // Undo last draw
  const onUndoLast = () => {
    if (!canvasContext) return;
    if (restoreIndex <= 0) {
      clearCanvas();
    } else {
      setRestoreState(({ index, array }) => {
        const newIndex = index - 1;
        const newArray = [...array];
        newArray.pop();
        canvasContext.putImageData(newArray[newIndex], 0, 0);
        return { index: newIndex, array: newArray };
      });
    }
  };

  const clickPencil = () => {
    if (!canvasContext) return;
    canvasContext.globalCompositeOperation = "source-over";
    setPainterState((prevState) => {
      return { ...prevState, isErasing: false };
    });
  };

  const clickEraser = () => {
    if (!canvasContext) return;
    canvasContext.globalCompositeOperation = "destination-out";
    setPainterState((prevState) => {
      return { ...prevState, isErasing: true };
    });
  };

  return (
    <Drawer
      data-testid="drawer"
      variant="permanent"
      anchor="bottom"
      open={open}
    >
      <Toolbar>
        <Fade in={!open}>
          <Stack
            data-testid="drawerStack"
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
              <IconButton onClick={clickPencil}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eraser">
              <IconButton onClick={clickEraser}>
                <SvgIcon>
                  <path d={mdiEraserVariant} />
                </SvgIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Undo">
              <IconButton onClick={onUndoLast}>
                <UndoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear canvas">
              <IconButton onClick={clearCanvas}>
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
              onChangeComplete={onChangeComplete}
              colorPickerState={colorPickerState}
              onUndoLast={onUndoLast}
              clearCanvas={clearCanvas}
              clickPencil={clickPencil}
              clickEraser={clickEraser}
            />
          </Toolbar>
        </Fade>
      </div>
    </Drawer>
  );
}
