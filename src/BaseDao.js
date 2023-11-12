import BaseDto from './BaseDto';
import BaseChannel from './BaseChannel';
import { createInstance } from './utils';

// TODO Tests

/**
 * Base data access object.
 */
export default class BaseDao {
    #dtoClass;
    #channel;

    constructor(dtoClass = BaseDto, channelClass = BaseChannel, ...params) {
        this.#dtoClass = dtoClass;
        this.#channel = createInstance(channelClass, ...params);
    }

    dataToDto(data) { // TODO JSDoc
        return createInstance(this.#dtoClass, data);
    }

    dtoToData(dto) { // TODO JSDoc
        return dto._params;
    }

    getDataStream() { // TODO JSDoc
        return this.#channel.getDataStream(); // FIXME Overwrite output with dataToDto()
    }
}