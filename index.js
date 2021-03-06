var path = require('path'),
	fs = require('fs'),
	edge = require('electron-edge-js'),
	activePrinter,
	initReady = false;


//
// Lets Make sure the Libraries are here
var libDir = path.join(__dirname, 'lib'),
	nodeDymoLib = path.join(libDir, 'NodeDymoLib.dll'),
	dymoLibPath = path.join('C:', 'Program Files (x86)', 'DYMO', 'DYMO Label Software', 'Framework'),
	dymoAssemblies = [ 'DYMO.Label.Framework.dll', 'DYMO.DLS.Runtime.dll', 'DYMO.Common.dll', 'DYMOPrinting.dll', 'PrintingSupportLibrary.dll' ],
	libsMoved = 0;

var initDymoLib = function() {
	if(++libsMoved < dymoAssemblies.length){ return false; }
	initReady = true;

	return true;
}

for( var f of dymoAssemblies ){
	if( fs.existsSync( path.join(libDir, f) ) ){ initDymoLib(); continue; } // Only fetch these files once
	console.log( 'Dymo Assembly ' + f );
	var source = path.join(dymoLibPath, f),
		target = path.join(libDir, f);
	var readStream = fs.createReadStream(source);
	var writeStream = fs.createWriteStream(target);
	readStream.on('error', function(err) { throw err });
	writeStream.on('error', function(err) { throw err });
	writeStream.on('finish', initDymoLib);
	readStream.pipe(writeStream);
}
// Lets Make sure the Libraries are here
//

var ready = module.exports.ready = function(){
	return initReady;
}


/** Get a list of all the printers
 * @return printer object info:
 */
 var getPrintersAsync = module.exports.getPrintersAsync = function( callback ){
	if( initReady != true ){	}

	var availablePrinters = edge.func({
		assemblyFile: nodeDymoLib,
		typeName: 'NodeDymoLib.Dymo',
		methodName: 'GetPrintersAsync'
	});

	availablePrinters( '', callback );
}

/**
 *	Same as getPrinters but syncronice
 */
 var getPrinters = module.exports.getPrinters = function(){
	if( initReady != true ){	}

	var availablePrinters = edge.func({
		assemblyFile: nodeDymoLib,
		typeName: 'NodeDymoLib.Dymo',
		methodName: 'GetPrinters'
	});

	return availablePrinters( '', true );
}


var getPrinter = module.exports.getPrinterSync = function( thisPrinterName ){
	if( thisPrinterName == '' ){ return true; }

	var availablePrinters = edge.func({
		assemblyFile: nodeDymoLib,
		typeName: 'NodeDymoLib.Dymo',
		methodName: 'GetPrinters'
	});

	var tempPrinters = availablePrinters( '', true );
	for( var i in tempPrinters ){
		console.log( tempPrinters[i] );
		if( tempPrinters[i].Name == thisPrinterName ){
			return tempPrinters[i];
		}
	}

	return false;
}


var setPrinter = module.exports.setPrinter = function( printerName ){
	// TODO: verify that this printer exists and return errors as needed.
	activePrinter = setPrinter;
}



/** Print out the label provided
 *  parameters: Object, parameters objects with the following structure:
		printer - String [Optional] - Name of the printer, if missing, will attempt to use the activePrinter (set by using setPrinter).
		jobTitle - String [Optional] - Name of the job to show up in the print queue
		labels - Object [Required] - One entry per label to print in this job.
			filename - String [Required]
			fields - Object [Optional] - What fields should be updated to what values
			images - Object [Optional] - Should be a buffer of PNG images with their related keys
	callback: a standard callback of (err, result);
 * @return printer object info:
 */
var print = module.exports.print = function( parameters, callback ){
	if( typeof callback != 'function' ){	callback = function(err, data){}	}

	var dymoPrint = edge.func({
		assemblyFile: nodeDymoLib,
		typeName: 'NodeDymoLib.Dymo',
		methodName: 'PrintLabelsAsync',
		references: [
				path.join(libDir, 'DYMO.Label.Framework.dll'),
				path.join(libDir, 'DYMO.DLS.Runtime.dll'),
				path.join(libDir, 'DYMO.Common.dll'),
				path.join(libDir, 'DYMOPrinting.dll'),
				path.join(libDir, 'PrintingSupportLibrary.dll'),
				path.join(libDir, 'x64', 'DYMOPrinting.dll'),
				path.join(libDir, 'x64', 'PrintingSupportLibrary.dll')
		]
	});

	if( typeof parameters.printer == 'undefined' ){
		if( activePrinter != null ){
			parameters.printer = activePrinter
		}else{
			return callback( 'Must Define the `printer`' );
		}
	}

	dymoPrint(parameters, callback);
}
