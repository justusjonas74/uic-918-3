import { NextRequest, NextResponse } from 'next/server';
import { readBarcode, interpretBarcode } from 'uic-918-3';

// Recursive helper to sanitize binary Buffers and serialize container properties
function serializeBuffers(obj: any): any {
  if (!obj) return obj;

  if (Buffer.isBuffer(obj)) {
    // Try to see if it is a printable ASCII string (useful for header elements)
    const str = obj.toString('utf8');
    if (/^[ -~]+$/.test(str) && str.length > 0) {
      return str;
    }
    return obj.toString('hex');
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBuffers);
  }

  if (typeof obj === 'object') {
    // Format TicketDataContainer structures explicitly
    if ('id' in obj && 'version' in obj && 'length' in obj && 'container_data' in obj) {
      return {
        id: obj.id,
        version: obj.version,
        length: obj.length,
        container_data: serializeBuffers(obj.container_data)
      };
    }

    const res: any = {};
    for (const key of Object.keys(obj)) {
      // Skip private fields starting with underscore
      if (key.startsWith('_')) continue;
      res[key] = serializeBuffers(obj[key]);
    }
    return res;
  }

  return obj;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!data) {
      return NextResponse.json({ error: 'Missing input data' }, { status: 400 });
    }

    let decodedResult;

    try {
      if (type === 'hex') {
        // Remove any whitespace, newlines, or colon delimiters from hex string
        const cleanHex = data.replace(/[\s:-]/g, '');
        const buffer = Buffer.from(cleanHex, 'hex');
        if (buffer.length === 0) {
          return NextResponse.json({ error: 'Invalid Hex string provided' }, { status: 400 });
        }
        // Call direct interpretation function of the library
        decodedResult = await interpretBarcode(buffer, true);
      } else if (type === 'image') {
        // Handle base64 image data URL (e.g. data:image/png;base64,iVBOR...) or raw base64
        let base64String = data;
        if (data.includes('base64,')) {
          base64String = data.split('base64,')[1];
        }
        const buffer = Buffer.from(base64String, 'base64');
        if (buffer.length === 0) {
          return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
        }
        // Call readBarcode which scans the image for barcode and interprets it
        decodedResult = await readBarcode(buffer, { verifySignature: true });
      } else {
        return NextResponse.json({ error: 'Invalid decoding type. Must be "hex" or "image".' }, { status: 400 });
      }
    } catch (verifError: any) {
      console.warn('Signature verification threw an error, falling back to simple decoding:', verifError.message);
      
      try {
        if (type === 'hex') {
          const cleanHex = data.replace(/[\s:-]/g, '');
          const buffer = Buffer.from(cleanHex, 'hex');
          decodedResult = await interpretBarcode(buffer, false);
        } else {
          let base64String = data;
          if (data.includes('base64,')) {
            base64String = data.split('base64,')[1];
          }
          const buffer = Buffer.from(base64String, 'base64');
          decodedResult = await readBarcode(buffer, { verifySignature: false });
        }
        
        // Mark signature as failed due to error
        decodedResult.validityOfSignature = `Error verifying signature: ${verifError.message}` as any;
        decodedResult.isSignatureValid = false;
      } catch (decodeError: any) {
        throw decodeError;
      }
    }

    const cleanResponse = serializeBuffers(decodedResult);
    return NextResponse.json({ success: true, result: cleanResponse });
  } catch (error: any) {
    console.error('Decoding failed:', error);
    return NextResponse.json({ success: false, error: error.message || 'Unknown decoding error' }, { status: 500 });
  }
}
