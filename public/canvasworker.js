onmessage =
  ("message",
  (e) => {
    const { msg, paintData } = e.data;
    // Do something with the data here!
    const { line, lineWidth } = paintData;
    console.log(msg);
    switch (msg) {
      case "start":
        // Create offscreen canvas
        const osc = new OffscreenCanvas(1000, 800);
        const ctx = osc.getContext("2d");
        // Draw on the canvas
        if (ctx) {
          line.forEach((position) => {
            const { offsetX, offsetY } = position.start;
            const { offsetX: x, offsetY: y } = position.stop;

            ctx.beginPath();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = "#19857b";
            // Move the the prevPosition of the mouse
            ctx.moveTo(x, y);
            // Draw a line to the current position of the mouse
            ctx.lineTo(offsetX, offsetY);
            // Visualize the line using the strokeStyle
            ctx.stroke();

            // Send canvas bitmap to be copied on the rendered canvas
            const btm = osc.transferToImageBitmap();
            postMessage({
              msg: "render",
              btm,
            });
          });
        }
        break;
      default:
        break;
    }
  });
