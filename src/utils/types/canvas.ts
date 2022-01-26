import { Dispatch, SetStateAction } from "react";

export interface Position {
  offsetX: number;
  offsetY: number;
}

export interface PainterState {
  isPainting: boolean;
  userStrokeStyle: string;
  prevPos: Position;
  isErasing: boolean;
  lineWidth: number;
  eraserRadius: number;
}

export interface RestoreState {
  array: ImageData[];
  index: number;
}

export interface Tools {
  canvasContext: CanvasRenderingContext2D | null;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
  isErasing: boolean;
  lineWidth: number;
  eraserRadius: number;
}
