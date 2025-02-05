import { BaseChannel } from '../index.js';

export default class CombinedChannel extends BaseChannel {
    static get actions() {
        return { CALL: 'call' };
    }

    call(daoList, callList) {
        if (typeof callList === 'string') {
            Promise.all(daoList.map(dao => dao[callList].call(dao))).then(data => this._update(data));
        } else if (daoList.length === callList.length) {
            Promise.all(daoList.map((dao, i) => {
                const callData = callList[i];
                if (typeof callData === 'string') {
                    return dao[callData].call(dao);
                } else {
                    const [action, ...params] = callData;
                    return dao[action].apply(dao, params);
                }
            })).then(data => this._update(data));
        } else {
            throw Error('CombinedChannel.call() callList and daoList are of different length');
        }
        return this.dataStream.current;
    }
}