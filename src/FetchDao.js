import CrudDao from './CrudDao.js';
import FetchChannel from './FetchChannel.js';

// TODO Tests, check JSDocs

/**
 * Data connector object for HTTP[S] fetch.
 * @class
 * @implements CrudDao
 */
export default class FetchDao extends CrudDao {
    constructor(dtoClass, channelClass = FetchChannel, ...params) {
        super(dtoClass, channelClass, ...params);
    }

    /**
     * Perform a POST request to a HTTP[S] endpoint.
     * @override
     * @param {URL} url Object creation endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @param {Object} value The body of the `Request` (the new object to create - optional)
     * @return {Promise<Response>} A `Promise` resolving to the `Response` object
     */
    create(url, init, dto) {
        return this.__exec__(false, 'POST', url, init, dto);
    }

    /**
     * Perform a GET request to a HTTP[S] endpoint.
     * @override
     * @param {URL} url Object retrieval endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @return {Promise<Response>} A `Promise` resolving to the `Response` object
     */
    read(url, init) {
        return this.__exec__(false, 'GET', url, init);
    }

    /**
     * Perform a PUT request to a HTTP[S] endpoint.
     * @override
     * @param {URL} url Object modification endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @param {Object} value The body of the `Request` (the new value - optional)
     * @return {Promise<Response>} A `Promise` resolving to the `Response` object
     */
    update(url, init, dto) {
        return this.__exec__(false, 'PUT', url, init, dto);
    }

    /**
     * Perform a DELETE request to a HTTP[S] endpoint.
     * @override
     * @param {URL} url Object deletion endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @return {Promise<Response>} A `Promise` resolving to the `Response` object
     */
    delete(url, init) {
        return this.__exec__(false, 'DELETE', url, init);
    }
}