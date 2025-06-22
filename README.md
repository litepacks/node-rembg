# Node.js Rembg Wrapper

This package provides a simple Node.js wrapper for the [rembg](https://github.com/danielgatis/rembg) Python tool. It allows you to remove the background from images by calling the `rembg` command-line interface from your Node.js code.

## Prerequisites

Before using this package, you must have the following installed on your system:

1.  **Python**: Ensure Python is installed and accessible from your command line.
2.  **Rembg**: You need to install the `rembg` library using pip.

    ```bash
    pip install rembg
    ```

    Also, make sure the `rembg` command is available in your system's PATH. You can verify this by running `rembg --version` in your terminal.

## Installation

You can install the package via npm:

```bash
npm install node-rembg
```
_(Note: This assumes the package is published to npm with the name `node-rembg`. For local use, you can just include it in your project)._

## Usage

The package exports a single function, `removeBackground`, which takes an input path, an output path, and an optional options object as arguments. It returns a Promise that resolves when the operation is complete.

Here's a basic example:

```javascript
// example.js
const { removeBackground } = require('./index'); // Use require('node-rembg') if installed from npm
const path = require('path');

const inputImagePath = path.join(__dirname, 'my-image.jpg');
const outputImagePath = path.join(__dirname, 'my-image-no-bg.png');

// By default, the process times out after 10 seconds.
// You can override this by providing a different timeout. For example, 30 seconds:
const options = {
  timeout: 30000,
};

console.log('Starting background removal...');

// Call with custom options
removeBackground(inputImagePath, outputImagePath, options)
  .then((outputPath) => {
    console.log(`Successfully removed background. Output saved to: ${outputPath}`);
  })
  .catch((error) => {
    console.error('An error occurred during background removal:');
    console.error(error);
  });

// ... or call without options to use the default 10-second timeout
removeBackground(inputImagePath, outputImagePath)
  .then((outputPath) => {
    console.log(`Successfully removed background. Output saved to: ${outputPath}`);
  })
  .catch((error) => {
    console.error('An error occurred during background removal:');
    console.error(error);
  });
```

### Removing Background from a URL

You can also process an image directly from a URL.

```javascript
const { removeBackgroundFromUrl } = require('./index');
const path = require('path');

const imageUrl = 'https://www.example.com/image.jpg';
const outputPath = path.join(__dirname, 'url-image-no-bg.png');

removeBackgroundFromUrl(imageUrl, outputPath)
  .then((savedPath) => {
    console.log(`Background removed and image saved to: ${savedPath}`);
  })
  .catch((error) => {
    console.error('Failed to remove background from URL:', error);
  });
```

### Parameters

#### `removeBackground(inputPath, outputPath, [options])`
* `inputPath` (string): The path to the input image.
* `outputPath` (string): The path to save the output image.
* `options` (object, optional):
    * `timeout` (number): The maximum time in milliseconds the process is allowed to run. **Defaults to 10000 (10 seconds).**

#### `removeBackgroundFromUrl(imageUrl, outputPath, [options])`
* `imageUrl` (string): The URL of the input image.
* `outputPath` (string): The path to save the output image.
* `options` (object, optional):
    * `timeout` (number): The maximum time in milliseconds for the process. **Defaults to 10000 (10 seconds).**

### How to Run the Example

1.  Place an image file named `my-image.jpg` in the same directory as `example.js`.
2.  Run the script from your terminal:

    ```bash
    node example.js
    ```

3.  A new file, `my-image-no-bg.png`, with the background removed, will be created in the same directory.

## Error Handling

The promise will be rejected if the `rembg` process fails. This could be due to several reasons:
*   `rembg` is not installed or not in the system's PATH.
*   The input file does not exist or is not a valid image.
*   Other processing errors from `rembg` itself.

The error object will contain details about the failure. 

*   The `rembg` process can be terminated if it exceeds the `timeout` specified in the options.
*   The input file does not exist or is not a valid image.
*   Other processing errors from `rembg` itself. # node-rembg
