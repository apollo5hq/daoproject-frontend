export interface Position {
  offsetX: number;
  offsetY: number;
}

export interface PainterState {
  isPainting: boolean;
  userStrokeStyle: string;
  line: { start: Position; stop: Position }[];
  prevPos: Position;
  isErasing: boolean;
  lineWidth: number;
}
