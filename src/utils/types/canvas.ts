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
}

export interface RestoreState {
  array: ImageData[];
  index: number;
}
