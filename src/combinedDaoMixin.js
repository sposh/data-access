import BaseChannel from './BaseChannel.js';
import DataStream from './DataStream.js';

export default function combinedDaoMixin(mixinDaoClass, mixinDtoClass, mixinDaoList, ...mixinParams) {
    return class extends mixinDaoClass {
        constructor(dtoClass = mixinDtoClass,
            channelClass = class CombinedChannel extends BaseChannel { // FIXME Avoid creation of unused dataStream
                #combinedDataStream = DataStream.combine(mixinDaoList.map(dao => dao.dataStream));

                get dataStream() {
                    return this.#combinedDataStream;
                }
            },
            params = mixinParams // TODO Test if this is the right syntax for multiple params
        ) {
            super(dtoClass, channelClass, ...params);
        }

        get daoList() {
            return mixinDaoList; // TODO Immutable?
        }
    };
}