import { FormParser } from "form-parser";
import { IncomingMessage } from "http";

export * from "form-parser";

export interface DataHead {
    name?: string,
    type?: string,
    file?: string,
    data?: Buffer
}

export interface DataGetterOptions {
    callback?: DataGetterCallback,
    final?: DataGetterFinal
}

export interface DataGetterCallback {
    (byte?: Buffer, file?: string, type?: string, name?: string): void
}

export interface DataGetterFinal {
    (dataHeaders?: DataHead[]): void
}

function parseData(req: IncomingMessage, opts: DataGetterOptions) {
    const fp = new FormParser(req);
    let dataHeaders: DataHead[] = [];
    let data: Buffer;
    let maxLength: number = 32;
    req.on('data', (chunk) => {
        fp.getData(chunk, (bytes: Buffer, file: string, type: string, name: string) => {
            if (opts.callback) {
                opts.callback(bytes, file, type, name);
            }
            if (!isHeadTaken(dataHeaders, name, file)) {
                data = (bytes.length < maxLength) ? bytes : bytes.subarray(0, maxLength)
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

function getData(req:IncomingMessage, cb?: DataGetterOptions): void;
function getData(req:IncomingMessage, cb?: DataGetterCallback, fn?: DataGetterFinal): void;
function getData(req:IncomingMessage, cb?: DataGetterCallback | DataGetterOptions, fn?: DataGetterFinal): void {
    
    let opts: DataGetterOptions = {
        callback: (): void => {},
        final: (): void => {}
    }
    if (typeof cb === 'function') {
        opts.callback = cb;
    }
    if (fn) {
        opts.final = fn;
    }
    if (typeof cb === 'object' ) {
        opts.callback = (cb.callback) ? cb.callback : opts.callback;
        opts.final = (cb.final) ? cb.final : opts.final;
    }
    
    parseData(req, opts);
}


export class DataGetter {
    static getData = getData;
}

function isHeadTaken(dataHeaders: DataHead[], name: string = '', file: string = ''): boolean {
    let index: number = dataHeaders.findIndex((dh) => {
        return dh.name == name && dh.file == file
    });
    return index !== -1;
}