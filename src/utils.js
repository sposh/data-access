import logger from 'winston';

// TODO JSDoc & tests

/**
 * Default unimplemented method for "abstract" classes and interfaces.
 */
export const abstractMethod = function(name) {
    throw Error(`unimplemented abstract method${name ? ` ${name}` : ''}`);
};

/**
 * Create an instance from a prototype or a class
 */
export function createInstance(prototype, ...params) { // TODO Test if this still works after Babel transpilation
    if (typeof prototype === 'function' && typeof prototype.constructor === 'function' && typeof prototype.prototype === 'object') {
        logger.debug(`utils.oop createInstance of ${prototype.name} with new`);
        return new prototype(...params);
    } else if (prototype !== null && typeof prototype === 'object' && typeof prototype.constructor === 'function' && typeof prototype.__proto__ === 'object') {
        logger.debug('utils.oop createInstance with Object.create');
        return Object.create(prototype, params);
    }
    logger.warn('utils.oop createInstance undefined');
}

function getAllNamesByDescriptorFilter(instance, descriptorFilter) {
    const properties = [];
    if (instance) {
        let currentPrototype = instance;
        while (currentPrototype !== null) {
            const descriptors = Object.getOwnPropertyDescriptors(currentPrototype);
            if (descriptorFilter) {
                properties.push(...Object.getOwnPropertyNames(descriptors).filter(value => descriptorFilter(descriptors, value)));
            } else {
                properties.push(...Object.getOwnPropertyNames(descriptors));
            }
            currentPrototype = Object.getPrototypeOf(currentPrototype); // TODO Make recursive instead of iterative
        }
    }
    const uniqueProperties = [...new Set(properties)];
    return uniqueProperties;
}

/**
 * Get all (including inherited) properties of an object
 */
export function getAllPropertyNames(instance) {
    return getAllNamesByDescriptorFilter(instance);
}

/**
 * Get all (including inherited) properties of an object that are functions
 */
export function getAllFunctionNames(instance) {
    return getAllNamesByDescriptorFilter(instance, (descriptors, value) => typeof descriptors[value].value === 'function');
}

/**
 * Get all (including inherited) properties of an object that are getters that don't begin with underscore
 */
 export function getAllGetterNames(instance) {
    return getAllNamesByDescriptorFilter(instance, (descriptors, value) => value.indexOf('_') !== 0 && typeof descriptors[value].get === 'function');
}

/**
 * Generic conversion of an instance into a string using it's getters and it's property values
 */
 export function instanceToString(instance) {
    let gettersString = getAllGetterNames(instance).reduce((acc, curr) => `${acc}${curr}: ${instance[curr]}, `, '');
    let jsonString = JSON.stringify(instance, (key, value) => {
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
    return `${instance.constructor.name}{ ${gettersString}${jsonString} }`;
}

// Deprecated
function createExternallyResolvablePromiseOld() {
    let _doResolve;
    const promise = new Promise((resolve, reject) => {
        try {
            _doResolve = data => {_doResolve = null; return resolve(data);};
        } catch (error) {
            reject(error);
        }
    });
    promise.doResolve = function (resolveData = null) {
        if (_doResolve === null) {
            logger.warn('doResolve already called for this Promise', promise);
            return promise.then(() => new Error('doResolve already called for this Promise'));
        } else {
            _doResolve(resolveData);
        }
        return promise.then(() => resolveData);
    };
    // Caution: can only call doResolve on original Promise, not on the copies returned by then/catch/finally (unless we uncomment the next line)
    // ['then', 'catch', 'finally'].forEach((method) => {addAttributeToAttributeReturn(promise, method, 'doResolve');}); // TODO propagate "already called" changes through promise chain
    return promise;
}

export function createExternallyResolvablePromise() {
    let resolver;
    const promise = new Promise(function (resolve) { // TODO handle reject
        resolver = function (data) {
            resolve(data);
            promise.doResolve = function () {
                logger.warn('Resolver already called for this Promise');
                return promise;
            }
            return promise;
        }
    });
    promise.doResolve = resolver;
    // Caution: can only call doResolve on original Promise, not on the copies returned by then/catch/finally (unless we uncomment the next line)
    // ['then', 'catch', 'finally'].forEach((method) => {addAttributeToAttributeReturn(promise, method, 'doResolve');}); // TODO propagate "already called" changes through promise chain
    return promise;
}