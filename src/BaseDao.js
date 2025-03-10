import { createInstance } from '@sposh/oop-utils';
import DataStream from './DataStream.js';
import BaseDto from './BaseDto.js';
import BaseChannel from './BaseChannel.js';

// TODO More tests, JSDoc

/**
 * Base data access object.
 */
export default class BaseDao extends DataStream {
    #dtoClass;
    #channel;
    #refresh;
    #end;

    constructor(dtoClass = BaseDto, channelClass = BaseChannel, ...channelParams) {
        let refresh, end;
        super(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
        this.#refresh = refresh;
        this.#end = end;
        Object.defineProperty(this, '__exec__', {
            value: (action, params, dto) => this.#exec(action, params, dto), // FIXME No protected classes in JS (but at least can be final)
        });
        this.#dtoClass = dtoClass;
        this.#channel = createInstance(channelClass, ...channelParams);
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

    #update(data) {
        if (this.#dtoClass) {
            const dtoParams = this._dataToDtoParams(data);
            this.#refresh(dtoParams ? createInstance(this.#dtoClass, ...dtoParams) : createInstance(this.#dtoClass));
        }
    };

    #callback(dataOrPromise) {
        const end = this.#end;
        if (typeof dataOrPromise?.then === 'function') { // TODO Create proper isPromise util
            return this._transformPromise(dataOrPromise).then(data => this.#update(data)).catch(reason => end(reason)); // TODO log reason; do we want to end?
        }
        this.#update(dataOrPromise);
    };

    #exec(action, params, dto) {
        if (typeof this.#channel[action] === 'function') {
            this.#channel[action](this.#callback.bind(this), params, this._dtoToData(dto));
        } // else return undefined
        return this;
    }
}