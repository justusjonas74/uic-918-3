# uic-918-3.js

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
![Build Status](https://github.com/justusjonas74/uic-918-3/actions/workflows/node.js.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/justusjonas74/uic-918-3/badge.svg?branch=master)](https://coveralls.io/github/justusjonas74/uic-918-3?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/8a9c146a8fdf552dbbcc/maintainability)](https://codeclimate.com/github/justusjonas74/uic-918-3/maintainability)
[![npm version](https://badge.fury.io/js/uic-918-3.svg)](https://badge.fury.io/js/uic-918-3)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A Node.js package written in Typescript for decoding and parsing barcodes according to the "UIC 918.3" specification, which is commonly used on Print and Mobile Tickets from public transport companies (e.g. Deutsche Bahn).

## Installation

To install the latest released version:

```bash
# Install as a dependency
npm install uic-918-3

# Install as a CLI tool
npm install -g uic-918-3
```

Or checkout the master branch on GitHub:

```bash
git clone https://github.com/justusjonas74/uic-918-3.git
cd uic-918-3
npm install
```

## Usage (CLI)

```bash
# Parse a ticket barcode from an image file:
uic918 image path/to/your/file.png

# To check the signature included in the ticket barcode:
uic918 image --verifySignature path/to/your/file.png
```

## Usage (Library)

```javascript
import { readBarcode } from 'uic-918-3';

// Input could be a string with path to image...
const image = '/path/to/your/file.png';
// ... or a Buffer object with an image
const image_as_buffer = fs.readFileSync('/path/to/your/file.png');

readBarcode('foo.png')
  .then((ticket) => console.log(ticket))
  .catch((error) => console.error(error));
```

### Options

Following options are available:

```javascript
import { readBarcode } from 'uic-918-3';

const image = '/path/to/your/file.png';
const options = {
  verifySignature: true // Verify the signature included in the ticket barcode with a public key set from a Public Key Infrastructure (PKI). The PKI url is set inside './lib/cert_url.json'. Default is 'false'.
};

uic.readBarcode(image, options).then((ticket) => {
  console.log(ticket.validityOfSignature); // Returns "VALID", "INVALID" or "Public Key not found"
  // ticket.isSignatureValid is deprecated. Use validityOfSignature instead.
});
//
```

### Returning object

The returning object consists of (among other things) one or more `TicketDataContainers` which hold ticket data for different purposes. The most interesting containers are:

- `**U_HEAD**` The ticket header ...
- `**U_TLAY**` A representation of the informations which are printed on the ticket.
- `**0080BL**` A specific container on tickets from Deutsche Bahn. Consists of all relevant information which will be used for proof-of-payment checks on the train.
- `**0080VU**` A specific container on (some) tickets from Deutsche Bahn. This container is used on products, which are also accepted by other carriers, especially (local) public transport companies. Get more information about this container [here](https://www.bahn.de/vdv-barcode).

### U_FLEX via WebAssembly

Experimental support for the new U_FLEX container is provided through a WebAssembly decoder that is generated from the official ASN.1 schema. The workflow is:

1. Install the native toolchain once on your machine (tested with `asn1c >= 0.9.29`, `emscripten >= 3.1`). On macOS that could look like:
   ```bash
   brew install asn1c emscripten
   ```
2. Build the decoder artifacts (downloads the schema if necessary, runs `asn1c`, and compiles the C bridge with Emscripten):
   ```bash
   npm run build:uflex-wasm
   ```
   The resulting `wasm/u_flex_decoder.{js,wasm}` files are bundled automatically with the npm package.
3. Use the high-level API:
   ```ts
   import { parseUFLEX, type UFLEXTicket } from 'uic-918-3';

   const ticket: UFLEXTicket = await parseUFLEX(hexPayloadFromBarcode);
   console.log(ticket.issuingDetail.issuingYear, ticket.travelerDetail?.traveler?.length);
   ```

The native decoder serializes the ASN.1 structure as canonical XER (XML), so even ältere `asn1c`-Versionen ohne JER-Unterstützung funktionieren. `parseUFLEX` nutzt `xml2js`, wandelt den XML-String in ein typsicheres `UFLEXTicket`-Objekt und erledigt alle notwendigen Typkonvertierungen (Zahlen, Booleans, Arrays) automatisch.

If the WASM artifacts are missing, `parseUFLEX` throws an actionable error instructing you to run the build step. The decoded structure is strongly typed via the `UFLEXTicket` interface so you can rely on `issuingDetail`, traveler metadata, and transport documents being available in a predictable shape.

## Optimize your files

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

## Expected Quality

The _UIC 913.3_ specifications aren't available for free, so the whole underlying logic is build upon third party sources, particularly the Python script [onlineticket](https://github.com/rumpeltux/onlineticket/) from Hagen Fritzsch, the [diploma thesis](https://monami.hs-mittweida.de/files/4983/WaitzRoman_Diplomarbeit.pdf) from Roman Waitz and the Wikipedia discussion about [Online-Tickets](https://de.wikipedia.org/wiki/Diskussion:Online-Ticket). Therefore results from this package (especially the parsing logic) should be taken with care.
Please feel free to open an issue, if you guess there's a wrong interpretation of data fields or corresponding values.

## Contributing

Feel free to contribute.
