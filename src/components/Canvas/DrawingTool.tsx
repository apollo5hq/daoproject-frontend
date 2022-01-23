import { Button, styled } from "@mui/material";

interface DrawingToolProps {
  onClick: () => void;
  name: string;
  variant: "outlined" | "contained";
}

const ToolButton = styled(Button)({
  textTransform: "none",
  height: 35,
});

export default function ({ onClick, variant, name }: DrawingToolProps) {
  return (
    <div style={{ padding: 5, paddingBottom: 0 }}>
      <ToolButton data-testid="drawingTool" variant={variant} onClick={onClick}>
        {name}
      </ToolButton>
    </div>
  );
}
