import fetch from 'node-fetch';
import BaseChannel from './BaseChannel.js';
import logger from './logger.js';

// TODO More tests, check JSDocs

/**
 * Data channel object for HTTP[S] fetch.
 * @implements CrudChannel
 */
export default class FetchChannel extends BaseChannel {
    /**
     * Perform a POST request to a HTTP[S] endpoint.
     * @param {URL} url Object creation endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @param {Object} value The body of the `Request` (the new object to create - optional)
     * @return {Promise<Response>} TODO
     */
    post(callback, params, data) {
        const url = params?.url;
        const init = params?.init;
        logger.http(`post ${url}`);
        callback(handleData(fetch(url, { method: 'POST', body: data, ...init })));
    }

    /**
     * Perform a GET request to a HTTP[S] endpoint.
     * @param {URL} url Object retrieval endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @return {Promise<Response>} TODO
     */
    get(callback, params) {
        const url = params?.url;
        const init = params?.init;
        logger.http(`get ${url}`);
        callback(handleData(fetch(url, { method: 'GET', ...init })));
    }

    /**
     * Perform a PUT request to a HTTP[S] endpoint.
     * @param {URL} url Object modification endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @param {Object} value The body of the `Request` (the new value - optional)
     * @return {Promise<Response>} TODO
     */
    put(callback, params, data) {
        const url = params?.url;
        const init = params?.init;
        logger.http(`put ${url}`);
        callback(handleData(fetch(url, { method: 'PUT', body: data, ...init })));
    }

    /**
     * Perform a DELETE request to a HTTP[S] endpoint.
     * @param {URL} url Object deletion endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @return {Promise<Response>} TODO
     */
    delete(callback, params) {
        const url = params?.url;
        const init = params?.init;
        logger.http(`delete ${url}`);
        callback(handleData(fetch(url, { method: 'DELETE', ...init })));
    }
}

// Wrap data-returning fetch `then`s to handle possible data errors
// TODO Change from Promise to await
function handleData(dataPromise) {
    return new Promise((resolve, reject) => {
        if (dataPromise) { // undefined if request is throttled
            dataPromise.then(data => {
                if (data) {
                    resolve(data);
                } else {
                    logger.info('No data');
                    reject(); // TODO multiple failures/retries/timeouts
                }
            }).catch(error => {
                logger.warn('Error handling fetch', error);
                reject(error); // TODO multiple failures/retries/timeouts
            });
        }
    });
}