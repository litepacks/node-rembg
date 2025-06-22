declare module 'node-rembg' {

  /**
   * Options for the background removal process.
   */
  export interface RembgOptions {
    /**
     * The timeout in milliseconds for the process.
     * @default 10000
     */
    timeout?: number;
  }

  /**
   * Removes the background from a local image file.
   *
   * @param inputPath The path to the input image.
   * @param outputPath The path to save the output image.
   * @param options Optional settings for the process.
   * @returns A promise that resolves with the output path.
   */
  export function removeBackground(
    inputPath: string,
    outputPath: string,
    options?: RembgOptions
  ): Promise<string>;

  /**
   * Removes the background from a remote image URL.
   *
   * @param imageUrl The URL of the input image.
   * @param outputPath The path to save the output image.
   * @param options Optional settings for the process.
   * @returns A promise that resolves with the output path.
   */
  export function removeBackgroundFromUrl(
    imageUrl: string,
    outputPath: string,
    options?: RembgOptions
  ): Promise<string>;

} 