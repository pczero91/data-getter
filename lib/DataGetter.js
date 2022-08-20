"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataGetter = void 0;
const form_parser_1 = require("form-parser");
class DataGetter {
    static getData(req, callback = () => { }, final = () => { }) {
        const fp = new form_parser_1.FormParser(req);
        let dataHeaders = [];
        let data;
        let maxLength = 32;
        req.on('data', (chunk) => {
            fp.getData(chunk, (bytes, file, type, name) => {
                callback(bytes, file, type, name);
                if (!isHeadTaken(dataHeaders, name, file)) {
                    data = (bytes.length < maxLength) ? bytes : bytes.subarray(0, maxLength);
                    dataHeaders.push({ name, type, file, data });
                }
            });
        });
        req.on('end', () => {
            final(dataHeaders);
        });
    }
}
exports.DataGetter = DataGetter;
function isHeadTaken(dataHeaders, name = '', file = '') {
    let index = dataHeaders.findIndex((dh) => {
        return dh.name == name && dh.file == file;
    });
    return index !== -1;
}
