import { abstractMethod } from '@sposh/oop-utils';
// TODO More tests

/**
 * Base data connector object.
 * @interface
 */
export default class BaseChannel { // TODO Change to CQRS with event sourcing for DDD & event-driven architecture; port/adapter?
    static get actions() { // FIXME Not too pleased with this fudge
        return { null: 'abstract' };
    }

    abstract(daoCallback, url, init, value) {
        abstractMethod('BaseChannel.abstract', daoCallback, url, init, value);
    }
}