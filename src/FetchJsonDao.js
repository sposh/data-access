import FetchChannel from './FetchChannel.js';
import FetchDao from './FetchDao.js';

// TODO More tests, JSDocs

export default class FetchJsonDao extends FetchDao {
    constructor(dtoClass, channelClass = class FetchJsonChannel extends FetchChannel {
        _update(response) {
            if (response) {
                super._update(response.json());
            }
        }
    }, ...params) {
        super(dtoClass, channelClass, ...params);
    }
}