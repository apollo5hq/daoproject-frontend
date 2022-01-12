export interface Position {
  offsetX: number;
  offsetY: number;
}

export interface PainterState {
  isPainting: boolean;
  userStrokeStyle: string;
  guestStrokeStyle: string;
  line: { start: Position; stop: Position }[];
  userId: string;
  prevPos: Position;
}
