import { connectStream } from './connectStream';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs';

describe('connectStream', () => {
    test('should throw when no stream is specified', () => {
        const caller = this;
        const key = 'testKey';

        expect(() => {
            connectStream(null, caller, key)
        }).toThrowError(`The passed stream for ${key} is not a valid RxJS stream`);
    });

    test('should throw when the first argument is not a valid observable', () => {
        const component = this;
        const key = 'testKey';
        const badStream$ = <Observable<any>>{};

        expect(() => {
            connectStream(badStream$, component, key)
        }).toThrowError(`The passed stream for ${key} is not a valid RxJS stream`);
    });

    test('should throw an error when the specified key does not exist in the state object', () => {
        const component = {state: {}};
        const key = 'testKey';
        const stream$ = Observable.of(null);

        expect(() => {
            connectStream(stream$, component, key)
        }).toThrowError(`key ${key} does not exist on the state`);
    });

    test('it should update the state when the stream pushes a new value', () => {
        const component = {state: {testKey: null}, setState: jest.fn()};
        const key = 'testKey';
        const stream$ = new Subject<any>();

        spyOn(component, 'setState');

        connectStream(stream$, component, key);
        stream$.next('data');

        const expectedData = {};
        expectedData[key] = 'data';
        expect(component.setState).toHaveBeenCalledWith(expectedData);
    });

    test('it should unsubscribe when the component will unmount', () => {
        const component = {
            state: {testKey: null},
            setState: jest.fn(),
            componentWillUnmount: jest.fn()
        };
        const key = 'testKey';
        const stream$ = Observable.of(null);
        const subscription = {unsubscribe: jest.fn()};

        spyOn(subscription, 'unsubscribe');
        spyOn(stream$, 'subscribe').and.returnValue(subscription);

        connectStream(stream$, component, key);
        component.componentWillUnmount();
        expect(subscription.unsubscribe).toHaveBeenCalled();
    });

    test('it should return a subscription', () => {
        const component = {
            state: {testKey: null},
            setState: jest.fn(),
            componentWillUnmount: jest.fn()
        };
        const key = 'testKey';
        const stream$ = Observable.of(null);
        const subscription = {unsubscribe: jest.fn()};

        spyOn(stream$, 'subscribe').and.returnValue(subscription);

        expect(connectStream(stream$, component, key)).toBe(subscription);
    });


    describe('given the component has an componentWillUnmount function', () => {
        test('it should call the original callback when the component will unmount', () => {
            const unmount = jest.fn();
            const component = {
                state: {testKey: null},
                setState: jest.fn(),
                componentWillUnmount: unmount
            };
            const key = 'testKey';
            const stream$ = Observable.of(null);

            connectStream(stream$, component, key);
            component.componentWillUnmount();
            expect(unmount).toHaveBeenCalled();
        });
    });
    describe('given the component has no componentWillUnmount function', () => {
        test('it should still work', () => {
            const component: any = {
                state: {testKey: null},
                setState: jest.fn()
            };
            const key = 'testKey';
            const stream$ = Observable.of(null);
            connectStream(stream$, component, key);
        });
    })
});
