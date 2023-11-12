import BaseDao from './BaseDao'

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
    create(key, context, value) {
        abstractMethod(`CrudDao.${[methods.CREATE]}`, key, context, this.dtoToData(value));
        return this.getDataStream();
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
        abstractMethod(`CrudDao.${[methods.READ]}`, key, context);
        return this.getDataStream();
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
    update(key, context, value) {
        abstractMethod(`CrudDao.${[methods.UPDATE]}`, key, context, this.dtoToData(value));
        return this.getDataStream();
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
        abstractMethod(`CrudDao.${[methods.DELETE]}`, key, context);
        return this.getDataStream();
    }
}

export const methods = Object.freeze({
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
});