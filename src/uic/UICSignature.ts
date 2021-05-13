import * as rs from 'jsrsasign'
import { ElementaryType, ElementaryTypes } from '../simpleTypes/ElementaryType'

export class UICSignature extends ElementaryType {
    
    public static fromBuffer(buffer: Buffer): UICSignature {
        const slicedBuffer = buffer.slice(14, 64)
        const name = "UIC Signature"
        return new UICSignature(slicedBuffer, name)
    } 

    public static checkSignature (publicKey: string, signedPayload: string, signature: string) : boolean {
      
      // Load public key from UICPublicKey Object  
      const publicKeyCertificate = rs.KEYUTIL.getKey('-----BEGIN CERTIFICATE-----\n' + publicKey + '\n-----END CERTIFICATE-----\n')
      
      // DSA signature validation
      const sig = new rs.KJUR.crypto.Signature({'alg': 'SHA1withDSA'})
      sig.init(publicKeyCertificate)
      sig.updateHex(signedPayload)
      return sig.verify(signature)
    }

    constructor(buffer: Buffer, name = "") {
      super(buffer, name)
      this.type = ElementaryTypes.UICSignature
    }
}

