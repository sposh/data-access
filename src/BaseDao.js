import BaseDto from './BaseDto';
import BaseChannel from './BaseChannel';
import { createInstance } from './utils';

// TODO More tests, JSDoc

/**
 * Base data access object.
 */
export default class BaseDao {
    #dtoClass;
    #channel;
    #dataStream;

    constructor(dtoClass = BaseDto, channelClass = BaseChannel, ...params) {
        this.#dtoClass = dtoClass;
        this.#channel = createInstance(channelClass, ...params);
        this.#dataStream = this.#dtoClass ? this.#channel.dataStream.createLinkedDataStream(data => {
            if (data !== undefined) {
                return (async () => {
                    const dtoParams = await this.dataToDtoParams(data);
                    if (dtoParams === null || typeof dtoParams[Symbol.iterator] !== 'function') {
                        return createInstance(this.#dtoClass, dtoParams); // Promise -> DTO with one parameter
                    } else {
                        return createInstance(this.#dtoClass, ...dtoParams); // Promise -> DTO with various parameters
                    }
                })();
            } // undefined
        }) : this.#channel.dataStream;
    }

    dataToDtoParams(data) { // TODO JSDoc - return array or undefined
        if (data !== undefined) {
            return [data];
        }
    }

    dtoToData(dto) { // TODO JSDoc
        return dto?._params;
    }

    getChannelAction(action) { // FIXME Not too pleased with this fudge
        if (Object.keys(this.#channel.constructor.actions).includes(action)) {
            // Would love to inject dto -> this.dtoToData(dto) automatically here, but there may be various parameters and we don't know which is/are DTOs
            return this.#channel[this.#channel.constructor.actions[action]].bind(this.#channel);
        } // else return undefined
    }

    get dataStream() { // TODO JSDoc
        return this.#dataStream;
    }
}