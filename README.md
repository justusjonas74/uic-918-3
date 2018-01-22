# uic-918-3.js

A Node.js package for decoding and parsing barcodes according to the "UIC 918.3" specification, which is commonly used on Print and Mobile Tickets from public transport companies (e.g. Deutsche Bahn).

## Installation

To install the latest released version:
```
npm install ***
```

Or checkout the master branch on GitHub:
```
git clone ***
cd ***
npm install
```

## Prepare your files
Actually the barcode reader is very dump, so the ticket you want to read, should be optimised before using this package. A better reading logic will be added in future versions.      

### Images
Actually the package only supports images with a "nice to read" barcode. So it's best to crop the image to the dimensions of the barcode and save it as a monochrome image (1 bit colour depth).  

## Extract barcode images from PDF files
You have to extract the barcode image from your PDF. The fastest (but not the best) way is to make a screen shot and save it as described before.
If you're using Linux or Mac OS X a much better way is to use `poppler-utils` and `imagemagick`:

```
# Extract images from pdf to .ppm or .pbm images. The last argument is a prefix for the extracted image file names.   
pdfimages your-ticket.pdf your-ticket
# convert .ppm/.pbm to a readable format (png)
convert your-ticket-00x.ppm your-ticket-00x.png;
```

## Usage

```javascript
const uic = require('***');

const file_path = '/path/to/your/file.png';

const onFulfilledFunction = (data) => {
  // Handle the Ticket object after parsing
  console.log(data);
}
const onRejectedFunction = (reason) => {
  // Handle Errors
  console.log(reason);
}

uic.readBarcode(file_path, onFulfilledFunction, onRejectedFunction);
```

## Assumed Quality
The *UIC 913.3* specifications aren't available for free, so the whole underlying logic is build upon third party sources, particularly the Python script [onlineticket](https://github.com/rumpeltux/onlineticket/) from Hagen Fritzsch, the [diploma thesis](https://monami.hs-mittweida.de/files/4983/WaitzRoman_Diplomarbeit.pdf) from Roman Waitz and the Wikipedia discussion about [Online-Tickets](https://de.wikipedia.org/wiki/Diskussion:Online-Ticket). Therefore results from this package (especially the parsing logic) should be taken with care.

## Contributing
Feel free to contribute.
