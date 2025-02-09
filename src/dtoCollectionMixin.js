import { createInstance } from '@sposh/oop-utils';

export default function dtoCollectionMixin(dtoClass) {
    return class DtoCollection extends Array {
        constructor(params) {
            if (params && typeof params.map === 'function') { // TODO Make more defensive
                super(...params.map(param => (param && param.map) ? createInstance(dtoClass, ...param) : createInstance(dtoClass, param))); // FIXME Improve on param && param.map (at least simply check if iterable)
            } else {
                super();
            }
            Object.freeze(this); // TODO Do we want this?
        }
        toString() {
            return `${this.constructor.name}[${super.toString()}]`;
        }
    }
}