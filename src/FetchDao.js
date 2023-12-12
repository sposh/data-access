import CrudDao from './CrudDao';
import FetchChannel from './FetchChannel';

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
        this.getChannelAction('POST')(url, init, this.dtoToData(dto));
        return this.dataStream.current;
    }

    /**
     * Perform a GET request to a HTTP[S] endpoint.
     * @override
     * @param {URL} url Object retrieval endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @return {Promise<Response>} A `Promise` resolving to the `Response` object
     */
    read(url, init) {
        this.getChannelAction('GET')(url, init);
        return this.dataStream.current;
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
        this.getChannelAction('PUT')(url, init, this.dtoToData(dto));
        return this.dataStream.current;
    }

    /**
     * Perform a DELETE request to a HTTP[S] endpoint.
     * @override
     * @param {URL} url Object deletion endpoint
     * @param {Object} [init] Any custom settings that you want to apply to the request (optional)
     * @return {Promise<Response>} A `Promise` resolving to the `Response` object
     */
    delete(url, init) {
        this.getChannelAction('DELETE')(url, init);
        return this.dataStream.current;
    }
}