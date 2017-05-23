import {Observable} from "rxjs/Observable";
import {connectStreams} from "./connectStreams";
import * as connectStream from "./connectStream";

describe("connectStreams", () => {
    test("should verify if the context' state has all keys", () => {
        const component = {state: {key1: null}, setState: jest.fn()};
        const keyVals = {key1: Observable.of(null), key2: Observable.of(null)};

        expect(() => {
            connectStreams(component, keyVals);
        }).toThrowError(`key key2 does not exist on the state`);
    });

    test("should connect each stream", () => {
        connectStream["connectStream"] = jest.fn();

        const component = {state: {key1: null, key2: null}, setState: () => {}};
        const keyVals = {key1: Observable.of(null), key2: Observable.of(null)};

        connectStreams(component, keyVals);

        expect(connectStream["connectStream"]).toHaveBeenCalledWith(keyVals["key1"], component, "key1");
        expect(connectStream["connectStream"]).toHaveBeenCalledWith(keyVals["key2"], component, "key2");
    });
});
