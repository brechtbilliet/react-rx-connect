import { connectStream } from './connectStream';
export function connectStreams(componentContext: any, keyVals: any): void {
    for (let key in keyVals) {
        connectStream(keyVals[key], componentContext, key);
    }
}