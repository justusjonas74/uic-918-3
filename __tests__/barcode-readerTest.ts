import {ZXing} from '../src/barcode-reader'

import {describe, expect, test} from '@jest/globals';

describe('barcode-reader.js', () => {
  describe('barcode-reader.ZXing', function () {
    this.timeout(4500)
    const dummy = 'test/images/barcode-dummy2.png'
    const ticket = Buffer.from('2355543031333431353030303033302e021500c28bc3abc283c385c39b49c2924a13c287c3a9c29ec395c28fc3a2c38c59c2aac28ac28c021500c3b66f662724c38a0b49c2a95d7fc281c2810cc2bfc2a5696d06c3ad00003031373078c29c4d4ec3810ac2824014c3bcc295c3b70125c3b376c39b6cc2bd09c28a1dc2b2c28434c3a8144b6c21c2a50777c3bdc3bf56106d18c39ec3a1c38d0c33c38dc3a3c298c2a719185052c3ae58710cc3854ac3913fc2a0c2a10438660ec2b62c276a1ec3b529c2bdc287106bc38e2fc3970621c28d09c38133c39d436906c39fc3b6c286c38ac391793b74c2a6c3afc381c2abc2bcc2afc38dc39bc2bac2ba7d7ec2acc2a7c3aa3b3ac2884514c2ba1a6cc3abc29c1f5fc296181bc2ba15672ac2ac33c29d1fc38cc398412e4e29451c4145c393320212602bc3b4c3bac290c389c2bc6a2e0dc28c02596bc3bc005e033b47', 'hex')
    test('should return an object on sucess', () => {
      return expect(ZXing(dummy)).toBeInstanceOf(Object);
    })
    test('should have property of raw', () => {
      return expect(ZXing(dummy)).resolves.toHaveProperty('raw');
    })
    test('should return the ticket data', () => {
      return expect(ZXing(dummy)).resolves.toHaveProperty('raw', ticket);
    })
  })
})
