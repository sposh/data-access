import { BaseDao, CombinedChannel, BaseDto } from '../index.js';

export default class CombinedDao extends BaseDao {
    #daoList;
    constructor (daoList, dtoClass = BaseDto, channelClass = CombinedChannel, ...params) {
        super(dtoClass, channelClass, ...params);
        this.#daoList = daoList;
    }

    call(callList) {
        this.getChannelAction('CALL')(this.#daoList, callList);
        return this.dataStream.current;
    }

    dataToDtoParams(data) {
        return data;
    }
}