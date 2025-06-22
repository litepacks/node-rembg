// example.js
const { removeBackground } = require('./index'); // Use require('node-rembg') if installed from npm
const path = require('path');

const inputImagePath = path.join(__dirname, 'my-image.jpg');
const outputImagePath = path.join(__dirname, 'my-image-no-bg.png');

console.log('Starting background removal with a timeout...');

// Set a very short timeout (e.g., 1ms) to test the timeout functionality.
// For real usage, you might want a longer timeout, like 30000 (30 seconds).
const options = {
  timeout: 10 * 1000,
};

removeBackground(inputImagePath, outputImagePath, options)
  .then((outputPath) => {
    console.log(`Successfully removed background. Output saved to: ${outputPath}`);
  })
  .catch((error) => {
    console.error('An error occurred during background removal:');
    console.error(error.message);
  });

// --- Example for remote URL ---
const { removeBackgroundFromUrl } = require('./index');

const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg';
const remoteOutputImagePath = path.join(__dirname, 'remote-image-no-bg.png');

console.log('\nStarting background removal from remote URL...');

removeBackgroundFromUrl(imageUrl, remoteOutputImagePath)
    .then((outputPath) => {
        console.log(`Successfully removed background from URL. Output saved to: ${outputPath}`);
    })
    .catch((error) => {
        console.error('An error occurred during background removal from URL:');
        console.error(error.message);
    }); 