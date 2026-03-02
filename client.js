document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('whiteboard');
  const context = canvas.getContext('2d');
  const colorInput = document.getElementById('color-input');
  const brushSizeInput = document.getElementById('brush-size');
  const brushSizeDisplay = document.getElementById('brush-size-display');
  const clearButton = document.getElementById('clear-button');
  const connectionStatus = document.getElementById('connection-status');
  const userCount = document.getElementById('user-count');

  function resizeCanvas() {
    // TODO: Set the canvas width and height based on its parent element
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    // Redraw the canvas with the current board state when resized
    // TODO: Call redrawCanvas() function
    redrawCanvas()
  }

  // Initialize canvas size
  // TODO: Call resizeCanvas()
  resizeCanvas()

  // Handle window resize
  // TODO: Add an event listener for the 'resize' event that calls resizeCanvas
  // document.addEventListener('resize', canvas.parentElement.clientWidth | canvas.parentElement.clientHeight, resizeCanvas())

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

    socket.on('draw', () => {
      boardState.push(drawData);
    })

    socket.on('clear', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    })

  })

  // Canvas event handlers
  // TODO: Add event listeners for mouse events (mousedown, mousemove, mouseup, mouseout)

  // Touch support (optional)
  // TODO: Add event listeners for touch events (touchstart, touchmove, touchend, touchcancel)




  // Clear button event handler
  // TODO: Add event listener for the clear button
  document.addEventListener('onClick', clearButton, clearCanvas());

  // Update brush size display
  // TODO: Add event listener for brush size input changes
  brushSizeInput.addEventListener('input', () => {
    console.log("brush size changed", brushSizeDisplay.innerText + "to" + brushSizeInput.value);
    brushSizeDisplay.innerText = brushSizeInput.value;
  })

  function startDrawing(e) {
    // TODO: Set isDrawing to true and capture initial coordinates
    isDrawing = true;
    coords = getCoordinates()
  }

  function draw(e) {
    // TODO: If not drawing, return
    if (!isDrawing) {return};
    // TODO: Get current coordinates
    

    // TODO: Emit 'draw' event to the server with drawing data
    socket.emit('draw', data)
    // TODO: Update last position
  }

  function drawLine(x0, y0, x1, y1, color, size) {
    // TODO: Draw a line on the canvas using the provided parameters
  }

  function stopDrawing() {
    // TODO: Set isDrawing to false
    isDrawing = false
  }

  function clearCanvas() {
    // TODO: Emit 'clear' event to the server
    socket.emit('clear')
  }

  function redrawCanvas(boardState = []) {

    // TODO: Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // TODO: Redraw all lines from the board state
  }

  // Helper function to get coordinates from mouse or touch event
  function getCoordinates(e) {
    if (e.type.includes('touch')) {// Get first touch point
      const touch = e.touches[0] || e.changedTouches[0];
      // Get canvas position
      const rect = canvas.getBoundingClientRect();
      // Calculate coordinates relative to canvas
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {// Mouse event
      return {
        x: e.offsetX,
        y: e.offsetY
      };
    }
  }

  // Handle touch events
  function handleTouchStart(e) {
    // TODO: Prevent default behavior and call startDrawing
    e.preventDefault();
    // Prevent scrolling
    const coords = getCoordinates(e);
    isDrawing = true;
    lastX = coords.x;
    lastY = coords.y;
    startDrawing()
  }

  function handleTouchMove(e) {
    // TODO: Prevent default behavior and call draw
  }
});
