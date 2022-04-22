# printkitty.js

<div style="text-align: center; display: inline-block; vertical-align: top;">
    <img src="img/uwu-transparent.png" alt="drawing" width="200"/>
    <span style="display: block;">~nyaa!</span>
</div>

&nbsp;

## What is this?

This is a (pretty awful) utility to use with 'Cat Printers', aka GBO1 / GT01 printers.

The are small, monochrome, battery powered thermal printers that communicate using Bluetooth Low Energy.

They are available at the usual online retailers such as [Amazon](https://www.amazon.co.uk/Wireless-Bluetooth-Printers-Learning-Compatible/dp/B09MCNVRJD/).

<div style="text-align: center; display: inline-block; vertical-align: top; border: 5px solid black; outline: 2px solid #FFF;">
    <img src="img/cat-printer.png" alt="The GB01 cat printer" width="200"/>
    <span style="display: block;">The "GB01" cat printer</span>
</div>

&nbsp;

## What can it do?

Right now, it can eject and retract paper, display device information and print images and text.

## How do I used it?

You'll need NodeJS and NPM installed, this has been tested with v17.


1. Clone this repository (or download it) by running;
`git clone https://github.com/mickwheelz/printkitty.js.git`

2. Change to the directory you cloned the code into: `cd printkitty.js`

3. Install the dependencies with `npm install`

4. Link the command with `sudo npm link`

Once you've done this you can simply run `printkitty --<options>` 

See the next section for some examples

### Examples

Print an image called `grumpy.png` that is in the same directory as the code

`printkitty --image grumpy.png`

Print "hello world" in Comic Sans at 100px high

`printkitty --text "hello world" --font "Comic Sans MS" --fontsize 100`

Eject paper for 100 steps

`printkitty --eject 100`

**NOTE:** it currently only auto-exits after printing images or text, for other commands you'll need to press `crtl+c` when they have finished.

### Command Reference

|Flag|Alias         |Description                                                                        |Data Type  |Default|Required|
|----|--------------|-----------------------------------------------------------------------------------|-----------|-------|--------|
|    |--version     |Show version number                                                                |boolean    |       |        |
| -i |--image       |Path to the image you want to print (e.g `~/folder/image.png`)                     |string     |       |Yes OR  |
| -t |--text        |Text you want to print, default font is Arial, 20px                                |string     |       |Yes OR  |
| -f |--font        |The font to use in quotes, this must be provided as it exists on your machine (e.g `"Comic Sans MS"`)                                     |string     |`"Arial"`|        |
| -s |--size        |The font size to use, in pixels high (e.g `16`)                                    |integer    |`20`   |        |
| -g |--getinfo     |Returns printer info in hex                                                        |boolean    |       |Yes OR  |
| -u |--getstatus   |Returns printer info in hex                                                        |boolean    |       |Yes OR  |   
| -e |--eject       |Ejects a number of lines of paper (e.g `50`)                                       |integer    |       |Yes OR  |
| -r |--retract     |Retracts the paper by a number of lines (e.g `50`)                                 |integer    |       |Yes OR  |
| -n |--devicename  |The name of your cat printer (e.g `GT01`)                                          |string     |`GB01` |Yes     |
| -o |--timeout     |Time in seconds to wait before aborting, when connecting to the printer (e.g `10`) |integer    |`5`    |        |
| -l |--loglevel    |Logging level to use. Options: `trace`, `debug`, `info`, `warn`, `error`, `fatal.` |string     |`info` |        |
| -h |--help        |Show help                                                                          |boolean    |       |        |


## Future Ideas

There are a tonne of general improvements and optimisations to make but I'd like to also implement features such as:

* RESTful API
* GUI/Front End
* IPP/PS driver so the printer can be used like a normal printer.

## Thanks

This sillyness was made possible by below group of other cat printer aficionados:

* There is a wealth of information in [JJJollyjim's](https://twitter.com/JJJollyjim) repo [here](https://github.com/JJJollyjim/catprinter) and links to other cat printer projects

* [WerWolv](https://twitter.com/WerWolv) did a lot of discovery and has a great blog post [here](https://werwolv.net/blog/cat_printer) as well as a python implementation [here](https://github.com/WerWolv/PythonCatPrinter)

* [bad_opcode](https://twitter.com/bad_opcode) further documented the printers protocol [here](https://github.com/JJJollyjim/catprinter/blob/f5322f7d728ed491218d788f0eff6cad7e11ab3f/COMMANDS.md) and has a python implementation [here](https://github.com/amber-sixel/gb01print), which helped a lot in building this.

* [noopkat](https://twitter.com/noopkat) built a nice little [floyd-steinberg package](https://github.com/noopkat/floyd-steinberg), that saved me when I was having issues with [sharp's](https://sharp.pixelplumbing.com/) version.

* Last but not least, [xssfox](https://twitter.com/xssfox) was the one who inspired me to join in on this in the first place, she also has a python implementation [here](https://gist.github.com/xssfox/b911e0781a763d258d21262c5fdd2dec)
