import { FormParser } from "form-parser";
import { IncomingMessage } from "http";

export interface DataHead {
    name?: string,
    type?: string,
    file?: string,
    data?: Buffer
}

export class DataGetter {
    static getData(req: IncomingMessage, callback: Function = (): void => {}, final: Function = (): void => {}) {
        const fp = new FormParser(req);
        let dataHeaders: DataHead[] = [];
        let data: Buffer;
        let maxLength: number = 32;
        req.on('data', (chunk) => {
            fp.getData(chunk, (bytes: Buffer, file: string, type: string, name: string) => {
                callback(bytes, file, type, name);
                if (!isHeadTaken(dataHeaders, name, file)) {
                    data = (bytes.length < maxLength) ? bytes : bytes.subarray(0, maxLength)
                    dataHeaders.push({ name, type, file, data });
                }
            });
        });
        req.on('end', () => {
            final(dataHeaders);
        });
    }
}

function isHeadTaken(dataHeaders: DataHead[], name: string = '', file: string = ''): boolean {
    let index: number = dataHeaders.findIndex((dh) => {
        return dh.name == name && dh.file == file
    });
    return index !== -1;
}