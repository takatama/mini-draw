# mini-draw

mini-draw is a lightweight and minimalistic drawing tool built with vanilla JavaScript. It focuses on providing essential features for quick and easy digital sketching and brainstorming.

## Features

- **Lightweight and Fast**: Designed to include only the essential features, making it responsive and easy to use.
- **Intuitive Interface**: A simple and user-friendly interface that requires no prior experience.
- **Built with Vanilla JavaScript**: No external libraries are used, ensuring simplicity and easy customization.

## Key Functions

- **Pencil Mode**: Allows freehand drawing with adjustable color and thickness for the pencil.
- **Bucket Mode**: Click to fill an area with a selected color.
- **Eraser Mode**: Erase parts of your drawing, with adjustable eraser size.
- **Background Color Mode**: Change the canvas background color to suit your needs.
- **Undo**: Step back to the previous state of your drawing.

## Demo

<a href="https://mini-draw.pages.dev/" target="_blank">View the mini-draw demo</a>

## Installation and Usage

### Basic Usage

1. Include the `mini-draw.umd.js` script in your HTML file.

2. Create a container element in your HTML where you want the Mini Draw widget to be inserted. For example:

   ```html
   <div id="app"></div>
   ```

3. Initialize the Mini Draw widget by calling `MiniDraw.init()` and passing the ID of the container element:

   ```html
   <script src="path/to/mini-draw.umd.js"></script>
   <script>
     MiniDraw.init("app");
   </script>
   ```

   You can also customize the widget by passing an options `object` to `MiniDraw.init()`. The available options are:

   - `canvasWidth` (number): The width of the canvas in pixels. Default is `340`.
   - `canvasHeight` (number): The height of the canvas in pixels. Default is `340`.
   - `pencilColor` (string): The color of the pencil tool in hex format. Default is `#000000`.
   - `bgColor` (string): The background color of the canvas in hex format. Default is `#FFFFEF`.
   - `thickness` (number): The thickness of the pencil tool in pixels. Default is `1`.
   - `eraserSize` (number): The size of the eraser tool in pixels. Default is `20`.

   Example with options:

   ```html
   <script src="path/to/mini-draw.umd.js"></script>
   <script>
     MiniDraw.init("app", {
       canvasWidth: 500,
       canvasHeight: 400,
       pencilColor: "#FF0000",
       bgColor: "#FFFFFF",
       thickness: 2,
       eraserSize: 30,
     });
   </script>
   ```

Here is a complete example with custom options:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini Draw</title>
  </head>

  <body>
    <div id="app"></div>
    <script src="path/to/mini-draw.umd.js"></script>
    <script>
      MiniDraw.init("app", {
        canvasWidth: 500,
        canvasHeight: 400,
        pencilColor: "#FF0000",
        bgColor: "#FFFFFF",
        thickness: 2,
        eraserSize: 30,
      });
    </script>
  </body>
</html>
```

### Development Setup

If you want to modify the code or contribute to the project, follow these steps to set up the development environment:

1. Clone the repository:

   ```bash
   git clone https://github.com/takatama/mini-draw.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mini-draw
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server with Vite:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` to see the app in action.

### Building for Production

To build the project for production, run:

```bash
npm run build
```

This will create the build files in the `dist` directory.

### Testing the Build

To test the production build locally, you can use the provided test setup:

1. Ensure that the build process has been completed and the `dist` directory contains the built files.

2. Navigate to the `test` directory:

   ```bash
   cd test
   ```

3. Open index.html in your browser to verify that the built mini-draw.umd.js is working correctly.

## Technologies Used

- HTML5 Canvas
- JavaScript (Vanilla JS)
- Vite for development and build process

## Contributing

Bug reports and feature requests are welcome via [Issues](https://github.com/takatama/mini-draw/issues). Pull requests are also highly appreciated!

## License

This project is licensed under the MIT License. For more details, please see the [LICENSE](LICENSE) file.
