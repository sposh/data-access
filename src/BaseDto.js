import { getAllGetterNames } from '@sposh/oop-utils';

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
        let gettersString = getAllGetterNames(this).reduce((acc, curr) => `${acc}"${curr}":${this[curr]}, `, '');
        let jsonString = JSON.stringify(this, (key, value) => {
            if (key.indexOf('_') !== 0) {
                return value;
            }
        });
        if (gettersString.length <= 0 || jsonString.length <= 2) {
            gettersString = gettersString.substring(0, gettersString.length - 2);
        }
        if (jsonString) {
            jsonString = jsonString.substring(1, jsonString.length - 1);
        } else {
            jsonString = ' }';
        }
        return `${this.constructor.name}{ ${gettersString}${jsonString} }`;
    }
}