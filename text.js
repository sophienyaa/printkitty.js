const sharp = require('sharp');
const image = require('./image');
const logger = require('./logger');
const textToImage = require('text-to-image');

/**
 * Creates an image from the given text to be processed and printed
 * @param {string} text - The text to print
 * @param {string} font - The font face to use (e.g Arial)
 * @param {integer} size - The font size to use, in pixels high
 * @return {Object} An object containing the image as a buffer, and info about it
 */
async function addTextOnImage(text, font, size) {
  try {
    const dataUri = await textToImage.generate(text, {
      debug: false,
      maxWidth: 384, //width of the printer
      fontSize: size,
      fontFamily: font,
      lineHeight: size+10,
      margin: 5,
      bgColor: 'white',
      textColor: 'black',
    });
    
    //TODO: this, better lol
    let buff = new Buffer(dataUri.substring(dataUri.indexOf(',') + 1), 'base64');
    
    return await sharp(buff)
                            //.flatten({ background: '#FFFFFF' })
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
