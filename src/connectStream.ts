import { Observable } from 'rxjs/Observable';
export function connectStream(stream$: Observable<any>, caller: any, key: string): void {
    const subscription = stream$.subscribe(val => {
        const stateObj = {};
        stateObj[key] = val;
        caller.setState(stateObj);
    });
    // hook into componentWillUnmount
    const oldFn = caller.componentWillUnmount;
    caller.componentWillUnmount = () => {
        oldFn.call(caller);
        subscription.unsubscribe();
    }
}