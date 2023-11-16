import logger from 'winston';
import fetch from 'node-fetch';
import BaseChannel from './BaseChannel.js';

// FIXME Logs binance signature
// TODO More tests, check JSDocs

/**
 * Data channel object for HTTP[S] fetch.
 * @abstract
 * @implements CrudChannel
 */
export default class FetchChannel extends BaseChannel {
    static get actions() {
        return { POST: 'post', GET: 'get', PUT: 'put', DELETE: 'delete' };
    }

    /**
     * Perform a POST request to a HTTP[S] endpoint.
     * @abstract
     * @param {URL} url Object creation endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @param {Object} value The body of the `Request` (the new object to create - optional)
     * @return {Promise<Response>} TODO
     */
    post(url, init, value) {
        logger.http(`post ${url}`);
        handleData(fetch(url, { method: 'POST', body: value, ...init })).then(data => this._update(data));
    }

    /**
     * Perform a GET request to a HTTP[S] endpoint.
     * @abstract
     * @param {URL} url Object retrieval endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @return {Promise<Response>} TODO
     */
    get(url, init) {
        logger.http(`get ${url}`);
        handleData(fetch(url, { method: 'GET', ...init })).then(data => this._update(data));
    }

    /**
     * Perform a PUT request to a HTTP[S] endpoint.
     * @abstract
     * @param {URL} url Object modification endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @param {Object} value The body of the `Request` (the new value - optional)
     * @return {Promise<Response>} TODO
     */
    put(url, init, value) {
        logger.http(`put ${url}`);
        handleData(fetch(url, { method: 'PUT', body: value, ...init })).then(data => this._update(data));
    }

    /**
     * Perform a DELETE request to a HTTP[S] endpoint.
     * @abstract
     * @param {URL} url Object deletion endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @return {Promise<Response>} TODO
     */
    delete(url, init) {
        logger.http(`delete ${url}`);
        handleData(fetch(url, { method: 'DELETE', ...init })).then(data => this._update(data));
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