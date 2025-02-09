import FetchJsonChannel from './FetchJsonChannel.js';
import FetchDao from './FetchDao.js';

// TODO More tests, JSDocs

export default class FetchJsonDao extends FetchDao {
    constructor(dtoClass, channelClass = FetchJsonChannel, ...params) {
        super(dtoClass, channelClass, ...params);
    }
}