import { createExternallyResolvablePromise } from './utils'

// TODO JSDoc & more tests

export default class DataStream {
    #last;
    #current = createExternallyResolvablePromise();

    // Call like: let refresh, end; new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
    constructor(refreshSetup = () => {}, endSetup = () => {}) { // TODO Add 3rd parameter bufferSize (and 4th parameter bufferIsGlobal?)
        refreshSetup(this.#refresh.bind(this));
        endSetup(this.#end.bind(this));
    }

    async *[Symbol.asyncIterator]() {
        yield this.last;
        while (this.current) {
            await this.current;
            yield this.last;
        }
        yield null;
    }

    get last() {
        return this.#last; // TODO Inmutable
    }

    get current() {
        return this.#current ? this.#current.then() : this.#current;
    }

    #refresh(data) {
        if (this.current) {
            this.#last = data;
            this.#current.doResolve(this.#last);
            this.#current = createExternallyResolvablePromise();
        }
    }

    #end() {
        this.#current = null;
    }

    toString() {
        return `${this.constructor.name}{ last: ${this.last}, current: ${this.current} }`;
    }
}

export function joinDataStreams(dataStreams, joinDataFunction, refresh, end) { // TODO Tests
    const joinedReply = new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
    Object.defineProperty(joinedReply, 'last', {
        get() {
            return joinDataFunction(dataStreams.map(dataStreams => dataStreams.last));
        },
    });
    Object.defineProperty(joinedReply, 'current', {
        get() {
            const doEnd = false;
            return Promise.all(dataStreams.map(dataStream => {
                const current = dataStream.current;
                if (current === null) {
                    doEnd = true;
                }
                if (doEnd) {
                    end();
                }
                return current;
            }));
        },
    });
    return joinedReply;
}