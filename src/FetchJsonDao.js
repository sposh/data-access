import FetchDao from './FetchDao.js';

// TODO More tests, JSDocs

export default class FetchJsonDao extends FetchDao {
    async dataToDtoParams(response) {
        return (response === undefined || response === null) ? response : super.dataToDtoParams(await response.json());
    }
}