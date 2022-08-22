"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataGetter = void 0;
const form_parser_1 = require("form-parser");
__exportStar(require("form-parser"), exports);
function parseData(req, opts) {
    const fp = new form_parser_1.FormParser(req);
    let dataHeaders = [];
    let data;
    let maxLength = 32;
    req.on('data', (chunk) => {
        fp.getData(chunk, (bytes, file, type, name) => {
            if (opts.callback) {
                opts.callback(bytes, file, type, name);
            }
            if (!isHeadTaken(dataHeaders, name, file)) {
                data = (bytes.length < maxLength) ? bytes : bytes.subarray(0, maxLength);
                dataHeaders.push({ name, type, file, data });
            }
        });
    });
    req.on('end', () => {
        if (opts.final) {
            opts.final(dataHeaders);
        }
    });
}
function getData(req, cb, fn) {
    let opts = {
        callback: () => { },
        final: () => { }
    };
    if (typeof cb === 'function') {
        opts.callback = cb;
    }
    if (fn) {
        opts.final = fn;
    }
    if (typeof cb === 'object') {
        opts.callback = (cb.callback) ? cb.callback : opts.callback;
        opts.final = (cb.final) ? cb.final : opts.final;
    }
    parseData(req, opts);
}
class DataGetter {
}
exports.DataGetter = DataGetter;
DataGetter.getData = getData;
function isHeadTaken(dataHeaders, name = '', file = '') {
    let index = dataHeaders.findIndex((dh) => {
        return dh.name == name && dh.file == file;
    });
    return index !== -1;
}
