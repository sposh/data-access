import BaseDto from './BaseDto';
import BaseChannel from './BaseChannel';
import DataStream from './DataStream';
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
        this.#dataStream = this.#channel.dataStream.createLinkedDataStream().addOutputMap(data => this.dataToDto(data));
    }

    dataToDto(data) { // TODO JSDoc
        if (data !== undefined) {
            return createInstance(this.#dtoClass, data);
        }
    }

    dtoToData(dto) { // TODO JSDoc
        return dto._params;
    }

    getChannelAction(action) {
        if (Object.keys(this.#channel.constructor.actions).includes(action)) {
            // Would love to inject dto -> this.dtoToData(dto) automatically here, but there may be various parameters and we don't know which is/are DTOs
            return this.#channel[this.#channel.constructor.actions[action]].bind(this.#channel);
        } // else return undefined
    }

    get dataStream() { // TODO JSDoc
        return this.#dataStream;
    }
}