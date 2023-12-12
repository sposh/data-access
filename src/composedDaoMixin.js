import BaseChannel from './BaseChannel';

// Usage: this.getChannelAction('UPDATE')(Promise.all([...])); return this.dataStream.current; -> dataToDtoParams(data): await data
export default function composedDaoMixin (mixinDaoClass, mixinDtoClass, ...mixinPrams) { // TODO Externalize (in @sposh/data-access)
    return class extends mixinDaoClass {
        constructor(dtoClass = mixinDtoClass,
            channelClass = class UpdateChannel extends BaseChannel {
                static get actions() {
                    return { UPDATE: '_update' };
                }
            }, params = mixinPrams // TODO Test if this is the right syntax for multiple params
        ) {
            super(dtoClass, channelClass, ...params);
        }
    };
}