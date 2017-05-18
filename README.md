# react-rx-connect

A small lightweight helper to connect RxJS observables to react component state.

## install

```
npm i react-rx-connect --save
```

## Problem

When using streams in React it's quite annoying to do manual subscribes and unsubscribes. When the component gets destroyed we have to unsubscribe all subscriptions to avoid memory-leaks. This results in messy code.
The code below is an example of a dirty, redundant rx maintainance.

```typescript
export class SomeComponent extends React.Component<any, any> {
    subscriptions = []; // some variable to manage the subscriptions
    state = {
        foo: null,
        bar: null
    };

    componentDidMount(): void {
        // subscribe manually => annoying
        // set the state manually => annoying
        // keep track of the subscriptions => annoying
        this.subscriptions.push(Observable.of('foo').subscribe(val => this.setState({foo: val})));
        this.subscriptions.push(Observable.of('bar').subscribe(val => this.setState({bar: val})));
    }
    
    // when the component gets destroyed, manually unsubscribe all subscriptions => annoying
    componentWillUnmount(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    render(): any {
        return (
            <div>
                <h1>Gifs</h1>
                {this.state.foo}
                {this.state.bar}
            </div>
        )
    }
}
```

## how to use it react-rx-connect


The **connectStreams** function will take an object of streams as the second parameter.
It will automatically update the state whenever a value in one of the streams changes.
When the component get's destroyed it will also automatically unsubscribe to avoid memory leaks.

```typescript

export class SomeComponent extends React.Component<any, any> {
    state = {
        foo: null, // this will be set based on some stream
        bar: null // this will be set based on some stream
    };

    componentDidMount(): void {
        // pass a number of observables to the connectStreams
        connectStreams(this, {
            foo: Observable.of('foo'),
            bar: Observable.of('bar')
        });
    }

    render(): any {
    	// since the state is updated by the connectedStreams function
    	// the values foo and bar will be available here, and automatically 
    	// updated
        return (
            <div>
                <h1>Gifs</h1>
                {this.state.foo} 
                {this.state.bar}
            </div>
        )
    }
}

```

We reduced the redundant messy code, to one line now.