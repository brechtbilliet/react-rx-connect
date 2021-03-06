import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
export function connectStream(stream$: Observable<any>, caller: any, key: string): Subscription {
    if (!stream$ || stream$.subscribe === undefined) {
        throw new Error(`The passed stream for ${key} is not a valid RxJS stream`);
    }
    if (!caller.state || caller.state[key] === undefined) {
        throw new Error(`key ${key} does not exist on the state`);
    }
    const subscription = stream$.subscribe(val => {
        const stateObj = {};
        stateObj[key] = val;
        caller.setState(stateObj);
    });
    // hook into componentWillUnmount
    const oldFn = caller.componentWillUnmount || function () {
    };
    caller.componentWillUnmount = () => {
        if (oldFn.call) {
            oldFn.call(caller);
        }
        subscription.unsubscribe();
    }
    return subscription;
}
