// TODO JSDoc & more tests; filter, debounce...

// Deprecated
function createExternallyResolvablePromiseOld() {
    let _doResolve;
    const promise = new Promise((resolve, reject) => {
        try {
            _doResolve = data => {_doResolve = null; return resolve(data);};
        } catch (error) {
            reject(error);
        }
    });
    promise.doResolve = function (resolveData = null) {
        if (_doResolve === null) {
            logger.warn('doResolve already called for this Promise', promise);
            return promise.then(() => new Error('doResolve already called for this Promise'));
        } else {
            _doResolve(resolveData);
        }
        return promise.then(() => resolveData);
    };
    // Caution: can only call doResolve on original Promise, not on the copies returned by then/catch/finally (unless we uncomment the next line)
    // ['then', 'catch', 'finally'].forEach((method) => {addAttributeToAttributeReturn(promise, method, 'doResolve');}); // TODO propagate "already called" changes through promise chain
    return promise;
}

function createExternallyResolvablePromise() { // TODO Change to Promise.withResolvers
    let resolver;
    const promise = new Promise(function (resolve) { // TODO handle reject
        resolver = function (data) {
            resolve(data);
            promise.doResolve = function () {
                logger.warn('Resolver already called for this Promise');
                return promise;
            }
            return promise;
        }
    });
    promise.doResolve = resolver;
    // Caution: can only call doResolve on original Promise, not on the copies returned by then/catch/finally (unless we uncomment the next line)
    // ['then', 'catch', 'finally'].forEach((method) => {addAttributeToAttributeReturn(promise, method, 'doResolve');}); // TODO propagate "already called" changes through promise chain
    return promise;
}

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