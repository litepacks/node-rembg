const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Removes the background from an image using the rembg CLI.
 * @param {string} inputPath - The path to the input image.
 * @param {string} outputPath - The path to save the output image.
 * @param {object} [options={}] - Additional options for the process.
 * @param {number} [options.timeout=10000] - The timeout in milliseconds for the background removal process. Defaults to 10000 (10 seconds).
 * @returns {Promise<string>} A promise that resolves with the output path upon successful background removal.
 */
function removeBackground(inputPath, outputPath, options = {}) {
  return new Promise((resolve, reject) => {
    // Ensure paths are absolute
    const absInputPath = path.resolve(inputPath);
    const absOutputPath = path.resolve(outputPath);

    // Default timeout is 10 seconds
    const { timeout = 10000 } = options;

    const rembg = spawn('rembg', ['i', absInputPath, absOutputPath], { timeout });

    let stderr = '';

    rembg.stdout.on('data', (data) => {
      // You can log stdout if needed for debugging
      // console.log(`stdout: ${data}`);
    });

    rembg.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    rembg.on('close', (code, signal) => {
      if (signal === 'SIGTERM') {
        return reject(new Error(`rembg process timed out after ${timeout}ms.`));
      }

      if (code === 0) {
        resolve(absOutputPath);
      } else {
        const error = new Error(`rembg process exited with code ${code}. Stderr: ${stderr}`);
        // Check for common errors
        if (stderr.includes('command not found') || stderr.includes('is not recognized')) {
            error.message = 'Rembg command not found. Please ensure Python and rembg are installed and in your system\'s PATH.';
        }
        reject(error);
      }
    });

    rembg.on('error', (err) => {
      // This typically happens if the command itself cannot be spawned
      const error = new Error(`Failed to start rembg process. Is it installed and in your PATH? Original error: ${err.message}`);
      reject(error);
    });
  });
}

/**
 * Removes the background from a remote image URL.
 * @param {string} imageUrl - The URL of the input image.
 * @param {string} outputPath - The path to save the output image.
 * @param {object} [options={}] - Additional options for the process.
 * @param {number} [options.timeout=10000] - The timeout in milliseconds for the process. Defaults to 10000 (10 seconds).
 * @returns {Promise<string>} A promise that resolves with the output path upon successful background removal.
 */
function removeBackgroundFromUrl(imageUrl, outputPath, options = {}) {
  return new Promise((resolve, reject) => {
    const { timeout = 10000 } = options; // Default timeout 10 seconds
    const absOutputPath = path.resolve(outputPath);

    const curl = spawn('curl', ['-sL', imageUrl]);
    const rembg = spawn('rembg', ['i'], { timeout });

    const outputStream = fs.createWriteStream(absOutputPath);

    let curlStderr = '';
    let rembgStderr = '';

    curl.stdout.pipe(rembg.stdin);
    rembg.stdout.pipe(outputStream);

    curl.stderr.on('data', (data) => {
      curlStderr += data.toString();
    });

    rembg.stderr.on('data', (data) => {
      rembgStderr += data.toString();
    });

    curl.on('close', (code) => {
      if (code !== 0) {
        rembg.kill();
        reject(new Error(`curl process exited with code ${code}. Stderr: ${curlStderr}`));
      }
    });

    rembg.on('close', (code, signal) => {
      if (signal === 'SIGTERM') {
        curl.kill();
        return reject(new Error(`rembg process timed out after ${timeout}ms.`));
      }
      if (code !== 0) {
        reject(new Error(`rembg process exited with code ${code}. Stderr: ${rembgStderr}`));
      }
    });

    curl.on('error', (err) => {
      rembg.kill();
      reject(new Error(`Failed to start curl process. Is it installed? Original error: ${err.message}`));
    });

    rembg.on('error', (err) => {
      curl.kill();
      reject(new Error(`Failed to start rembg process. Is it installed? Original error: ${err.message}`));
    });

    outputStream.on('finish', () => {
      resolve(absOutputPath);
    });

    outputStream.on('error', (err) => {
      curl.kill();
      rembg.kill();
      reject(new Error(`Failed to write to output file ${absOutputPath}. Error: ${err.message}`));
    });
  });
}

module.exports = {
  removeBackground,
  removeBackgroundFromUrl,
}; 