import FetchDao from './FetchDao.js';

// TODO More tests, JSDocs

export default class FetchJsonDao extends FetchDao {
    async _transformPromise(responsePromise) {
        console.log();
        return await (await responsePromise)?.json();
    }
}