"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLocalCerts = exports.filePath = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const fs_1 = require("fs");
const axios_1 = tslib_1.__importDefault(require("axios"));
const xml2js = tslib_1.__importStar(require("xml2js"));
const parser = new xml2js.Parser();
const { url, fileName } = JSON.parse((0, fs_1.readFileSync)('./cert_url.json', 'utf8'));
const basePath = (0, path_1.dirname)('./cert_url.json');
exports.filePath = (0, path_1.join)(basePath, fileName);
const updateLocalCerts = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Load public keys from ${url} ...`);
        const response = yield axios_1.default.get(url);
        if (response && response.status == 200) {
            console.log(`Successfully loaded key file.`);
        }
        parser.parseString(response.data, function (err, result) {
            if (!err) {
                (0, fs_1.writeFileSync)(exports.filePath, JSON.stringify(result));
                console.log(`Loaded ${result.keys.key.length} public keys and saved under "${exports.filePath}".`);
            }
            else {
                console.log(err);
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateLocalCerts = updateLocalCerts;
