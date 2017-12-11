import { connectStream } from './connectStream';
import { Subscription } from 'rxjs/Subscription';
export type SubscriptionHash = { [key: string]: Subscription }
export function connectStreams(componentContext: any, keyVals: any) : SubscriptionHash {
    const subscriptions: SubscriptionHash = {};
    for (let key in keyVals) {
        if (!componentContext.state || componentContext.state[key] === undefined) {
            throw new Error(`key ${key} does not exist on the state`);
        }
        subscriptions[key] = connectStream(keyVals[key], componentContext, key);
    }
    return subscriptions;
}
