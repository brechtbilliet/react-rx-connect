import { Observable } from 'rxjs/Observable';
import { connectStreams, SubscriptionHash } from './connectStreams';
import * as connectStream from './connectStream';
import { Subscription } from 'rxjs/Subscription';

describe('connectStreams', () => {
    test('should verify if the context\' state has all keys', () => {
        const component = {state: {key1: null}, setState: jest.fn()};
        const keyVals = {key1: Observable.of(null), key2: Observable.of(null)};

        expect(() => {
            connectStreams(component, keyVals);
        }).toThrowError(`key key2 does not exist on the state`);
    });

    test('should connect each stream', () => {
        jest.spyOn(connectStream, 'connectStream');

        const component = {
            state: {key1: null, key2: null}, setState: () => {
            }
        };
        const keyVals = {key1: Observable.of(null), key2: Observable.of(null)};

        connectStreams(component, keyVals);

        expect(connectStream['connectStream']).toHaveBeenCalledWith(keyVals['key1'], component, 'key1');
        expect(connectStream['connectStream']).toHaveBeenCalledWith(keyVals['key2'], component, 'key2');
    });

    test('should return subscriptions', () => {
        (connectStream as any)['connectStream'].mockRestore();

        const component = {
            state: {key1: null, key2: null}, setState: () => {
            }
        };
        const stream1$ = Observable.of(null);
        const stream2$ = Observable.of(null);
        const subscription1 = {unsubscribe: jest.fn()};
        const subscription2 = {unsubscribe: jest.fn()};

        spyOn(stream1$, 'subscribe').and.returnValue(subscription1);
        spyOn(stream2$, 'subscribe').and.returnValue(subscription2);
        const keyVals = {key1: stream1$, key2: stream2$};

        const subscriptions = connectStreams(component, keyVals);

        expect(subscriptions.key1).toBe(subscription1);
        expect(subscriptions.key2).toBe(subscription2);
    });
});
