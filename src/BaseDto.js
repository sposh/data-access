import { instanceToString } from './utils';

/**
 * Base class for data transfer objects.
 */
export default class BaseDto {
    #params;

    constructor(...params) {
        this.#params = params;
    }

    get _params() {
        return this.toInmutable(this.#params);
    }

    // TODO JSDoc
    toInmutable(param) {
        return Object.freeze(param);
    }

    // TODO JSDoc
    toShallowCopy(param) { // TODO Handle other weird types like iterators
        return param instanceof Array ? [...param] : param instanceof Object ? Object.assign({}, param) : param;
    }

    toString() {
        return instanceToString(this);
    }
}