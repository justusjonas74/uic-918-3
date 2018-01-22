# uic-918-3.js

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

const file_path = '/path/to/your/file.png';

const onFulfilledFunction = (data) => {
  // Handle the Ticket object after parsing
  console.log(data);
};

const onRejectedFunction = (reason) => {
  // Handle Errors
  console.log(reason);
};

uic.readBarcode(file_path, onFulfilledFunction, onRejectedFunction);
```

The `data` object consists of (among other things) one or more TicketDataContainers which hold ticket data for different purposes. The most interesting containers are:

* **U_HEAD** The ticket header ...
* **U_TLAY** A representation of the informations which are printed on the ticket.
* **0080BL** A specific container on tickets from Deutsche Bahn. Consists of all relevant information which will be used for proof-of-payment checks on the train.
* **0080VU** A specific container on (some) tickets from Deutsche Bahn. This container is used on products, which are also accepted by other carriers, especially (local) public transport companies. Get more information about this container [here](https://www.bahn.de/vdv-barcode).    

## Assumed Quality
The *UIC 913.3* specifications aren't available for free, so the whole underlying logic is build upon third party sources, particularly the Python script [onlineticket](https://github.com/rumpeltux/onlineticket/) from Hagen Fritzsch, the [diploma thesis](https://monami.hs-mittweida.de/files/4983/WaitzRoman_Diplomarbeit.pdf) from Roman Waitz and the Wikipedia discussion about [Online-Tickets](https://de.wikipedia.org/wiki/Diskussion:Online-Ticket). Therefore results from this package (especially the parsing logic) should be taken with care.

## Contributing
Feel free to contribute.
