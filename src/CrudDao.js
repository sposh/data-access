import BaseDao from './BaseDao.js'

// TODO Tests, check JSDoc

/**
 * Base data access object for CRUD operations.
 */
export default class CrudDao extends BaseDao {
    /**
     * Create a new object. Should *not* be idempotent.
     * @abstract
     * @throws {Error} Abstract method - will throw an error if called.
     * @param {*} key Where the object should be created
     * @param {*} [context] Extra parameters or configuration (optional)
     * @param {*} [value] The new object to create (optional)
     * @return {*} The created object, or `undefined` if object is not created
     */
    create(key, context, dto) {
        return this.__exec__(false, null, key, context, dto);
    }

    /**
     * Find an existing object. Should not modify any data.
     * @abstract
     * @throws {Error} Abstract method - will throw an error if called.
     * @param {*} key Where the object can be found
     * @param {*} [context] Extra parameters or configuration (optional)
     * @return {*} The found object, or `undefined` if object is not found
     */
    read(key, context) {
        return this.__exec__(false, null, key, context);
    }

    /**
     * Modify an existing object. *Should* be idempotent.
     * @abstract
     * @throws {Error} Abstract method - will throw an error if called.
     * @param {*} key Where the existing object can be found
     * @param {*} [context] Extra parameters or configuration (optional)
     * @param {*} value The new object (optional)
     * @return {*} The modified object, or `undefined` if object is not found
     */
    update(key, context, dto) {
        return this.__exec__(false, null, key, context);
    }

    /**
     * Delete an existing object. *Should* be idempotent.
     * @abstract
     * @throws {Error} Abstract method - will throw an error if called.
     * @param {*} key Where the object can be found
     * @param {*} [context] Extra parameters or configuration (optional)
     * @return {*} The deleted object, or `undefined` if object is not found
     */
    delete(key, context) {
        return this.__exec__(false, null, key, context);
    }
}