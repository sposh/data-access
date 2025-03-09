import { createInstance } from '@sposh/oop-utils';
import DataStream from './DataStream.js';
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
    #refresh;
    #end;

    constructor(dtoClass = BaseDto, channelClass = BaseChannel, ...params) {
        Object.defineProperty(this, '__exec__', {
            value: (newDataStream, action, key, context, dto, ...params) => this.#exec(newDataStream, action, key, context, dto, ...params), // FIXME No protected classes in JS (but at least can be final)
        });
        this.#dtoClass = dtoClass;
        this.#channel = createInstance(channelClass, ...params);
        this.#newDataStream()
    }

    #newDataStream() {
        this.#dataStream = new DataStream(refreshSetup => this.#refresh = refreshSetup, endSetup => this.#end = endSetup);
    }

    _dataToDtoParams(data) { // TODO JSDoc - return array or undefined // FIXME No protected classes in JS
        if (data !== undefined) {
            return [data];
        }
    }

    _dtoToData(dto) { // TODO JSDoc // FIXME No protected classes in JS
        return dto?._params;
    }

    async _transformPromise(promise) { // TODO JSDoc // FIXME No protected classes in JS
        return await promise;
    }

    #exec(newDataStream, action, key, context, dto, ...params) {
        if (newDataStream) {
            this.#newDataStream();
        }
        const refresh = this.#refresh;
        const end = this.#end;
        const update = data => {
            if (this.#dtoClass) {
                const dtoParams = this._dataToDtoParams(data);
                refresh(dtoParams ? createInstance(this.#dtoClass, ...dtoParams) : createInstance(this.#dtoClass));
            }
        };
        if (Object.keys(this.#channel.constructor.actions).includes(action)) {
            this.#channel[this.#channel.constructor.actions[action]].call(this.#channel, promise => {
                return this._transformPromise(promise).then(data => update(data)).catch(reason => end(reason)); // TODO log reason; do we want to end?
            }, key, context, this._dtoToData(dto), ...params);
        } // else return undefined
        return this.#dataStream;
    }
}