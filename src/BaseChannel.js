import DataStream from './DataStream.js';

// TODO More tests

/**
 * Base data connector object.
 * @interface
 */
export default class BaseChannel { // TODO Change to CQRS with event sourcing for DDD & event-driven architecture; port/adapter?
    static get actions() { // FIXME Not too pleased with this fudge
        return { UPDATE: '_update', 'CLOSE': '_close' }; // return {};
    }

    #dataStream;
    #refresh;
    #end;

    constructor() { // TODO Make singleton
        this.#dataStream = new DataStream(refreshSetup => this.#refresh = refreshSetup, endSetup => this.#end = endSetup);
    }

    get dataStream() {
        return this.#dataStream;
    }

    _update(data) { // TODO JSDoc
        this.#refresh(data);
    }

    _close() { // TODO JSDoc
        this.#end();
    }
}