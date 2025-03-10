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
     * @param {Object} [params] Any custom settings that you want to apply to the request (optional)
     * @param {Object} value The body of the `Request` (the new object to create - optional)
     * @return {Promise<Response>} A `Promise` resolving to the `Response` object
     */
    create(url, params, dto) {
        return this.__exec__('post', { url, init: params }, dto);
    }

    /**
     * Perform a GET request to a HTTP[S] endpoint.
     * @override
     * @param {URL} url Object retrieval endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @return {Promise<Response>} A `Promise` resolving to the `Response` object
     */
    read(url, params) {
        return this.__exec__('get', { url, init: params });
    }

    /**
     * Perform a PUT request to a HTTP[S] endpoint.
     * @override
     * @param {URL} url Object modification endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @param {Object} value The body of the `Request` (the new value - optional)
     * @return {Promise<Response>} A `Promise` resolving to the `Response` object
     */
    update(url, params, dto) {
        return this.__exec__('put', { url, init: params }, dto);
    }

    /**
     * Perform a DELETE request to a HTTP[S] endpoint.
     * @override
     * @param {URL} url Object deletion endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @return {Promise<Response>} A `Promise` resolving to the `Response` object
     */
    delete(url, params) {
        return this.__exec__('delete', { url, init: params });
    }
}