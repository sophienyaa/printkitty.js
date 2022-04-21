const sharp = require('sharp');
const image = require('./image');
const logger = require('./logger');

async function addTextOnImage(text, font, size) {
  try {

    //TODO make this dynamic / genrally improve it. Works for now though
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

module.exports ={
    printText: async function(text, font, size) {
        const txtImg = await addTextOnImage(text, font, size);
        logger.trace('Formatting text for printing...');
        return await image.buildBMP(txtImg);
    }
}
