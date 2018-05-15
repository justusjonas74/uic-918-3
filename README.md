# uic-918-3.js
[![Build Status](https://travis-ci.org/justusjonas74/uic-918-3.svg?branch=master)](https://travis-ci.org/justusjonas74/uic-918-3)
[![Coverage Status](https://coveralls.io/repos/github/justusjonas74/uic-918-3/badge.svg?branch=master)](https://coveralls.io/github/justusjonas74/uic-918-3?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/8a9c146a8fdf552dbbcc/maintainability)](https://codeclimate.com/github/justusjonas74/uic-918-3/maintainability)
[![npm version](https://badge.fury.io/js/uic-918-3.svg)](https://badge.fury.io/js/uic-918-3)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A Node.js package for decoding and parsing barcodes according to the "UIC 918.3" specification, which is commonly used on Print and Mobile Tickets from public transport companies (e.g. Deutsche Bahn).

## Installation

To install the latest released version:
```bash
npm install uic-918-3
```

Or checkout the master branch on GitHub:
```bash
git clone https://github.com/justusjonas74/uic-918-3.git
cd uic-918-3
npm install
```

## Prepare your files
Actually the barcode reader is very dump, so the ticket you want to read, should be optimised before using this package. A better reading logic will be added in future versions.

### Images
Actually the package only supports images with a "nice to read" barcode. So it's best to crop the image to the dimensions of the barcode and save it as a monochrome image (1 bit colour depth).

### Extract barcode images from PDF files
You have to extract the barcode image from your PDF. The fastest (but not the best) way is to make a screen shot and save it as described before.
If you're using Linux or Mac OS X a much better way is to use `poppler-utils` and `imagemagick`:

```bash
# Extract images from pdf to .ppm or .pbm images. The last argument is a prefix for the extracted image file names.
pdfimages your-ticket.pdf your-ticket
# convert .ppm/.pbm to a readable format (png)
convert your-ticket-00x.ppm your-ticket-00x.png;
```

## Usage

```javascript
const uic = require('uic-918-3');

const file_path = '/path/to/your/file.png'; // could also be a Buffer

uic.readBarcode(file_path).then((ticket)=>{
  //do something with the ticket
});
```
### Options
Following options are available:
```javascript
const options = {
    verifySignature: true // Verify the signature included in the ticket barcode with a public key set from a Public Key Infrastructure (PKI). The PKI url is set inside './lib/cert_url.json'. Default is 'false'.
}

uic.readBarcode(file_path, options).then((ticket)=>{
  console.log(ticket.isSignatureValid) // Returns 'true' or 'false'.
});
// 
```

### Returning object
The returning object consists of (among other things) one or more `TicketDataContainers` which hold ticket data for different purposes. The most interesting containers are:

* `**U_HEAD**` The ticket header ...
* `**U_TLAY**` A representation of the informations which are printed on the ticket.
* `**0080BL**` A specific container on tickets from Deutsche Bahn. Consists of all relevant information which will be used for proof-of-payment checks on the train.
* `**0080VU**` A specific container on (some) tickets from Deutsche Bahn. This container is used on products, which are also accepted by other carriers, especially (local) public transport companies. Get more information about this container [here](https://www.bahn.de/vdv-barcode).

## Expected Quality
The *UIC 913.3* specifications aren't available for free, so the whole underlying logic is build upon third party sources, particularly the Python script [onlineticket](https://github.com/rumpeltux/onlineticket/) from Hagen Fritzsch, the [diploma thesis](https://monami.hs-mittweida.de/files/4983/WaitzRoman_Diplomarbeit.pdf) from Roman Waitz and the Wikipedia discussion about [Online-Tickets](https://de.wikipedia.org/wiki/Diskussion:Online-Ticket). Therefore results from this package (especially the parsing logic) should be taken with care.
Please feel free to open an issue, if you guess there's a wrong interpretation of data fields or corresponding values.

## Contributing
Feel free to contribute.
