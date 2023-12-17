import { createExternallyResolvablePromise } from './utils'

// TODO JSDoc & more tests; filter, debounce...

export default class DataStream {
    static combine(dataStreams) { // TODO JSDoc
        let refresh;
        let end;
        const combinedStream = new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
        let lastValues = new Array(dataStreams.length);
        dataStreams.forEach(async (dataStream, i) => {
            for await (const value of dataStream) {
                // FIXME If this ended stop iterating for all streams
                lastValues[i] = value; // can overwrite old values, this is expected
                if (!lastValues.includes()) { // if no more undefineds
                    refresh(lastValues);
                    lastValues = new Array(dataStreams.length); // don't mutate
                }
            }
            // FIXME Call .end() on any ended stream
            });
        return combinedStream;
    }

    #last;
    #current = createExternallyResolvablePromise();
    #refreshListeners = [];
    #endListeners = [];

    // Call like: let refresh, end; new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
    constructor(refreshSetup = () => {}, endSetup = () => {}) { // TODO Add 3rd parameter bufferSize (and 4th parameter bufferIsGlobal?)
        refreshSetup(this.#refresh.bind(this));
        endSetup(this.#end.bind(this));
    }

    async *[Symbol.asyncIterator]() {
        while (this.#current) {
            await this.#current;
            yield this.last;
        }
    }

    get last() {
        return this.#last; // TODO Ensure inmutability
    }

    get current() {
        return this.#current ? this.#current.then() : this.#current; // Ensure inmutability
    }

    map(dataMapFn) {
        let refresh, end;
        const linkedDataStream = new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
        linkedDataStream.toString = () => `LinkedDataStream{${this}}`; // TODO Remove?
        this.#refreshListeners.push(async data => refresh(await dataMapFn(data)));
        this.#endListeners.push(end);
        return linkedDataStream;
    }

    #refresh(data) {
        if (this.#current) {
            const lastCurrent = this.#current;
            this.#last = data;
            this.#current.doResolve(this.last);
            this.#current = createExternallyResolvablePromise();
            this.#refreshListeners.forEach(linkedRefresh => linkedRefresh(data));
            return lastCurrent;
        }
    }

    #end() {
        this.#current = null;
        this.#endListeners.forEach(linkedEnd => linkedEnd());
    }

    toString() {
        return `${this.constructor.name}{ last: ${this.last}, current: ${this.current} }`;
    }
}