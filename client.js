document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('whiteboard');
  const context = canvas.getContext('2d');
  const colorInput = document.getElementById('color-input');
  const brushSizeInput = document.getElementById('brush-size');
  const brushSizeDisplay = document.getElementById('brush-size-display');
  const clearButton = document.getElementById('clear-button');
  const connectionStatus = document.getElementById('connection-status');
  const userCount = document.getElementById('user-count');

  let boardState = [];

  function resizeCanvas() {
    // TODO: Set the canvas width and height based on its parent element
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    // Redraw the canvas with the current board state when resized
    // TODO: Call redrawCanvas() function
    redrawCanvas(boardState)
  }

  // Initialize canvas size
  // TODO: Call resizeCanvas()
  resizeCanvas()

  // Handle window resize
  // TODO: Add an event listener for the 'resize' event that calls resizeCanvas
  window.addEventListener('resize', resizeCanvas)

  // Drawing variables
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Connect to Socket.IO server
  // TODO: Create a socket connection to the server at 'http://localhost:3000'
  const socket = io.connect('http://localhost:3000')
  socket.on('connect', () => {
    // TODO: Set up Socket.IO event handlers
    console.log('connected to server');
    connectionStatus.innerText = 'Connected';

    socket.on('currentUsers', (numUsers) => {
      console.log(numUsers, "users")
      userCount.innerText = numUsers;
    })

    socket.on('boardState', (state) => {
      console.log('boardstate')
      console.log(state)
      setTimeout(()=>{ //delay as it sometimes wouldn't load right, couldn't figure it out
        redrawCanvas(state)
      }, 1000);
    })

    socket.on('draw', (drawData) => {
      boardState.push(drawData);
      drawLine(drawData.x0, drawData.y0, drawData.x1, drawData.y1, drawData.color, drawData.size);
    })

    socket.on('clear', () => {
      boardState=[];
      context.clearRect(0, 0, canvas.width, canvas.height);
    })

  })

  // Canvas event handlers
  // TODO: Add event listeners for mouse events (mousedown, mousemove, mouseup, mouseout)
  canvas.addEventListener('mousedown', startDrawing)
  canvas.addEventListener('mousemove', draw)
  canvas.addEventListener('mouseup', stopDrawing)
  canvas.addEventListener('mouseout',stopDrawing)

  // Touch support (optional)
  // TODO: Add event listeners for touch events (touchstart, touchmove, touchend, touchcancel)




  // Clear button event handler
  // TODO: Add event listener for the clear button
  clearButton.addEventListener('click', clearCanvas);

  // Update brush size display
  // TODO: Add event listener for brush size input changes
  brushSizeInput.addEventListener('input', () => {
    console.log("brush size changed", brushSizeDisplay.innerText + "to" + brushSizeInput.value);
    brushSizeDisplay.innerText = brushSizeInput.value;
  })

  function startDrawing(e) {
    // TODO: Set isDrawing to true and capture initial coordinates
    isDrawing = true;
    coords = getCoordinates(e)
    lastX = coords.x
    lastY = coords.y
  }

  function draw(e) {
    // TODO: If not drawing, return
    if (!isDrawing) {return};
    // TODO: Get current coordinates
    coords = getCoordinates(e)

    // TODO: Emit 'draw' event to the server with drawing data
    socket.emit('draw', {
      x0: lastX,
      y0: lastY,
      x1: coords.x,
      y1: coords.y,
      color: colorInput.value,
      size: brushSizeInput.value
    })
    // TODO: Update last position
    lastX = coords["x"]
    lastY = coords["y"]
  }

  function drawLine(x0, y0, x1, y1, color, size) {
    // TODO: Draw a line on the canvas using the provided parameters
    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
  }

  function stopDrawing() {
    // TODO: Set isDrawing to false
    isDrawing = false
  }

  function clearCanvas() {
    // TODO: Emit 'clear' event to the server
    socket.emit('clear');
  }

  function redrawCanvas(boardState = []) {

    // TODO: Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // TODO: Redraw all lines from the board state
    boardState.forEach(item => {
      drawLine(item.x0, item.y0, item.x1, item.y1, item.color, item.size);
    });
  }

  // Helper function to get coordinates from mouse or touch event
  function getCoordinates(e) {
    // if (e.type.includes('touch')) {// Get first touch point
    //   const touch = e.touches[0] || e.changedTouches[0];
    //   // Get canvas position
    //   const rect = canvas.getBoundingClientRect();
    //   // Calculate coordinates relative to canvas
    //   return {
    //     x: touch.clientX - rect.left,
    //     y: touch.clientY - rect.top
    //   };
    // } else {// Mouse event
      return {
        x: e.offsetX,
        y: e.offsetY
      };
    }
  // }

  // Handle touch events
  function handleTouchStart(e) {
    // TODO: Prevent default behavior and call startDrawing
    e.preventDefault();
    // Prevent scrolling
    const coords = getCoordinates(e);
    isDrawing = true;
    lastX = coords.x;
    lastY = coords.y;
    startDrawing(e)
  }

  function handleTouchMove(e) {
    // TODO: Prevent default behavior and call draw
  }
});
