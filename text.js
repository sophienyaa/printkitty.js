const sharp = require('sharp');
const image = require('./image');
const logger = require('./logger');

/**
 * Creates an image from the given text to be processed and printed
 * @param {string} text - The text to print
 * @param {string} font - The font face to use (e.g Arial)
 * @param {integer} size - The font size to use, in pixels high
 * @return {Object} An object containing the image as a buffer, and info about it
 */
async function addTextOnImage(text, font, size) {
  try {

    //TODO make this dynamic / generally improve it. Works for now though
    const width = 348;
    const height = 348;

    const svgImage = `
    <svg width="${width}" height="${height}">
      <style>
      .title { fill: #001; font-size: ${size}px; font-family:"${font}"}
      </style>
      <text x="50%" y="50%" text-anchor="middle" class="title">${text}</text>
    </svg>
    `;

    const svgBuffer = Buffer.from(svgImage);
    return await sharp(svgBuffer)
                            .flatten({ background: '#FFFFFF' })
                            .extractChannel('green')
                            .raw()
                            .toBuffer({ resolveWithObject: true });
  } catch (error) {
    logger.error(error, 'Oh noes!');
  }
}

module.exports = {
    /**
   * Creates an bitmap from the given text to be processed and printed
   * @param {string} text - The text to print
   * @param {string} font - The font face to use (e.g Arial)
   * @param {integer} size - The font size to use, in pixels high
   * @return {Array} An array of 48 byte buffers, 1 per line of the image
   */
    processText: async function(text, font, size) {
        const txtImg = await addTextOnImage(text, font, size);
        logger.trace('Formatting text for printing...');
        return await image.buildBMP(txtImg);
    }
}
