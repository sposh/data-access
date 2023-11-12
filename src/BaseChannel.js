import DataStream from './DataStream';

// TODO Tests

/**
 * Base data connector object.
 * @interface
 */
export default class BaseChannel { // TODO Change to CQRS with event sourcing for DDD & event-driven architecture; port/adapter?
    #dataStream;

    constructor() {
        let refresh, end;
        this.#dataStream = new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
        this.#dataStream.refresh = refresh;
        this.#dataStream.end = end;
    }

    getDataStream() {
        return this.#dataStream; // FIXME Recipients should not be able to refresh/end
    }

    _update(data) { // TODO JSDoc
        if (data !== undefined) {
            this.#dataStream.refresh(data);
        }
        return this.#dataStream;
    }

    _close() { // TODO JSDoc
        this.#dataStream.end();
    }
}