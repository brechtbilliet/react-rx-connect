import { connectStream } from './connectStream';
export function connectStreams(componentContext: any, keyVals: any): void {
    for (let key in keyVals) {
        if(!componentContext.state || componentContext.state[key] === undefined) {
            throw new Error(`key ${key} does not exist on the state`);
        }
        connectStream(keyVals[key], componentContext, key);
    }
}