import DataStream from './DataStream';

// TODO Tests

/**
 * Base data connector object.
 * @interface
 */
export default class BaseChannel { // TODO Change to CQRS with event sourcing for DDD & event-driven architecture; port/adapter?
    static get actions() {
        return {};
    }

    #dataStream;
    #refresh;
    #end;

    constructor() {
        this.#dataStream = new DataStream(refreshSetup => this.#refresh = refreshSetup, endSetup => this.#end = endSetup);
    }

    get dataStream() {
        return this.#dataStream;
    }

    _update(data) { // TODO JSDoc
        if (data !== undefined) {
            this.#refresh(data);
        }
    }

    _close() { // TODO JSDoc
        this.#end();
    }
}