# Printer Dymo

An Electron Node.js module for interacting with Dymo LabelWriter printers using the [DLS SDK](http://developers.dymo.com/). This library is built and maintained by [Paul Prins](https://github.com/paulprins/) of [Fresh Vine](https://freshvine.co/) for their [Event Kiosk](https://freshvine.co/Event-Kiosk/).

## Installation

You will need the latest [Dymo LabelWriter software](http://download.dymo.com/dymo/Software/Win/DLS8Setup.8.5.1.exe) installed first.  This provides all of the dependent Dymo libraries.

``` bash
$ npm install printer-dymo --save
```

## Use

This impementation is still very young but is production ready.

```
var printerDymo = require('printer-dymo'),
	fs = require('fs');

// It takes a second or two for initialization to complete.
setTimeout(function(){

	// Gets an array of IPrinter objects (Dymo printers on the current system)
	printerDymo.getPrintersAsync(null, function(err, printers){
		if (err) throw err;
		console.log(printers);
	});

	// A print object;
	var printArgs = {
		printer: 'DYMO LabelWriter 450',	//name of printer
		jobTitle: 'My Sweet Labels',
		labels:[{
			filename: 'test.label',		//path to label
			fields: {
				name: 'Timmy',
				barcode: '100360931'
			},
			images: {
				photo: fs.readFileSync('face.png')
			}
		}]
	};

	printerDymo.print(printArgs, function(err, res){
		if (err) throw err;
		console.log("Finished Printing.");
	});

}, 2000);

```

### getPrinter

### getPrinters();

### getPrintersSync();

## TODO

- [x] Test coverage  
- [x] Build instructions  
- [ ] Make use of EventEmitter and fire Ready event after initialization  
- [ ] Improve API  
- [ ] Travis CI  

## Building

Prerequisits:

Install [Node.js](https://nodejs.org/en/download/).  Then install gyp:

``` bash
$ npm install -g node-gyp
```

For gyp you will also need:

* On Windows:
  * [Python 2.7.x](https://www.python.org/getit/windows)
  * Microsoft Visual Studio C++ 2015
  * [Windows 64-bit SDK](https://msdn.microsoft.com/en-us/windows/desktop/bg162891.aspx)
  * [Dymo LabelWriter v8.5.1](http://download.dymo.com/dymo/Software/Win/DLS8Setup.8.5.1.exe)


## Publishing

``` bash
npm pack
npm publish

```

## Contributing

Fork, add unit tests for any new or changed functionality.

Lint and test your code.

## Release History

* 1.0.0 Rebuilt the C# library as a shared library resource and not have Synchronous & Asynchronous functions.  
	Now includes 2 missing DYMO libraries (`DYMOPrinting.dll` & `PrintingSupportLibrary.dll`) that caused errors when deployed. These are included with both x86 & x64 flavors. 
* 0.4.0 Refactored C# `dymo.cs` to use dynamic variables inplace of object variables.  
* 0.1.0 Fix: Had default print copies set to 3 for testing that was committed.  
* 0.0.3 Printing multiple labels in a single print job.  
* 0.0.1 Initial release; Module boilerplate.  
