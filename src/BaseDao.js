import { createInstance } from '@sposh/oop-utils';
import BaseDto from './BaseDto.js';
import BaseChannel from './BaseChannel.js';

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
        this.#dataStream = this.#channel.dataStream.map(data => {
            if (data !== undefined) {
                return (async () => {
                    const dtoParams = await this.dataToDtoParams(data);
                    if (this.#dtoClass) {
                        console.log(this.#dtoClass, dtoParams);
                        return dtoParams ? createInstance(this.#dtoClass, ...dtoParams): createInstance(this.#dtoClass);
                    } else {
                        return dtoParams;
                    }
                })();
            } // undefined
        });
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