var iconv = require('iconv-lite');

exports.fixingZXing = (buffer) => {
    // FIX: https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding
    // WORKAROUND:
    iconv.skipDecodeWarning = true;
    const latin1str = iconv.decode(buffer.toString('utf-8'), 'ISO-8859-1');
    return Buffer.from(latin1str, 'latin1');
};

exports.stringifyBufferObj = function (obj) {
  for (const key in obj) {
    if (Buffer.isBuffer(obj[key])) {
      obj[key] = obj[key].toString();
    }
  }
  return obj;
};

exports.interpretField = function (data,fields) {
  var remainder = data;
  var res = {};
  fields.forEach( f => {
    var interpretFunction;
    if (f[2]) {
      interpretFunction = f[2];
    } else {
      interpretFunction = (x) => x;
    }
    if (f[1]) {
      res[f[0]] = interpretFunction(remainder.slice(0,f[1]));
      remainder = remainder.slice(f[1]);
    } else {
      res[f[0]] = interpretFunction(remainder);
    }
  });
  return res;
};

exports.parseContainers = function (data, f){
  var remainder = data;
  var containers = [];
  while (remainder.length > 0) {
    const result = f(remainder);
    containers.push(result[0]);
    //if (containers.length < 10 ) {console.log(containers)};
    remainder = result[1];

  }
  return containers;
};
