"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UICPublicKeys = void 0;
var axios_1 = require("axios");
var xml2js = require("xml2js");
var fs = require("fs");
// const fsPromises = fs.promises;
// import * as localKeys from './../../keys.json'
var UICPublicKeys = /** @class */ (function () {
    function UICPublicKeys() {
    }
    // private localKeys : IUICPublicKeys = localKeys
    UICPublicKeys.fetchKeysFromUrl = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var parser, url, keysXML, keys, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parser = new xml2js.Parser({ explicitArray: false });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        url = options.url || "https://railpublickey.uic.org/download.php";
                        return [4 /*yield*/, axios_1["default"].get(url)];
                    case 2:
                        keysXML = _a.sent();
                        console.log(keysXML.data);
                        return [4 /*yield*/, parser.parseStringPromise(keysXML.data)
                            // const keys = this.parseKeysFromXML(keysXML.data)
                        ];
                    case 3:
                        keys = _a.sent();
                        // const keys = this.parseKeysFromXML(keysXML.data)
                        console.log(keys);
                        return [2 /*return*/, keys];
                    case 4:
                        err_1 = _a.sent();
                        throw err_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UICPublicKeys.fetchKeysToFile = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = options.fileName || UICPublicKeys.keysJsonFileName;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.fetchKeysFromUrl(options)];
                    case 2:
                        data = _a.sent();
                        console.log(data);
                        return [4 /*yield*/, fs.promises.writeFile(filePath, JSON.stringify(data))
                            // return
                        ];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        throw err_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UICPublicKeys.keysJsonFileName = "../../keys.json";
    return UICPublicKeys;
}());
exports.UICPublicKeys = UICPublicKeys;
var CommentForEncryptionType;
(function (CommentForEncryptionType) {
    CommentForEncryptionType["Empty"] = "";
    CommentForEncryptionType["PublicKeyPem"] = "public_key.pem";
    CommentForEncryptionType["SNCFNSGates16050CERTPem"] = "SNCF-NSGates-16050CERT.pem";
    CommentForEncryptionType["SNCFTER2CERTPem"] = "SNCF-TER-2-CERT.pem";
})(CommentForEncryptionType || (CommentForEncryptionType = {}));
