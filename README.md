# printkitty.js

~nyaa!

## What is this?

This is a (pretty awful) utility to use with 'Cat Printers', aka GBO1 / GT01 printers.

The are small, monochrome battery powered thermal printers that communicate using Bluetooth Low Energy.

 They are available at the usual online retailers such as [Amazon](https://www.amazon.co.uk/Wireless-Bluetooth-Printers-Learning-Compatible/dp/B09MCNVRJD/).

 ## What can it do?

 Right now, it can eject and retract paper, display device information and print images.

## How do I used it?

You'll need NodeJS installed, this has been tested with v17.

Once you've cloned the repo, run `npm instal` to install dependancies.

Then run `node index.js` with the options you need, see below table for details.

e.g `node index.js --image grumpy.png --loglevel trace`

|Flag|Alias|Description|Data Type|Default|Required|
|----|-----|-----------|----------|------|--------|
|    |--version     |Show version number                                                                         |boolean|
| -i |--image       |Path to the image you want to print (e.g ~/folder/image.png)                                 |string|
| -t |--text        |Text you want to print, default font is Arial, 20pt                                          |string|
| -f |--font        |The font family to use (e.g Comic Sans)                                                  |string| "arial" |
| -s |--size        |The font size to use (e.g 16)                                                           |integer|20|
| -g |--getinfo     |Returns printer info in hex                                                                 |boolean|
| -u |--getstatus   |Returns printer info in hex                                                                 |boolean||
| -e |--eject       |Ejects a number of lines of paper (e.g 50)                                                   |integer||
| -r |--retract     |Retracts the paper by a number of lines (e.g 50)                                             |integer||
| -n |--devicename  |The name of your cat printer (e.g GT01)                                                      |string|"GB01"| Yes |
| -o |--timeout     |Time in seconds to wait before aborting, when connecting to the printer (e.g 10)         |integer|5||
| -l |--loglevel    |Logging level to use, values are trace, debug, info, warn, error, fatal. Defaults to error |string|"info"|
| -h |--help        |Show help                                                                                   |boolean| |


