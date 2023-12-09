import { BaseDao, BaseChannel, BaseDto } from '..';

test('Basic BaseDao', async () => {
    class ChannelClass extends BaseChannel {
        static get actions() {
            return { UPDATE: 'update', CLOSE: 'close' };
        }
        update(data) {
            return this._update(data);
        }
        close() {
            this._close();
        }
    };
    class DtoClass extends BaseDto {
        #value;
        constructor(value) {
            super(value);
            this.#value = value;
        }
        get value() {
            return this.#value;
        }
    };
    const dao = new (class MyDao extends BaseDao {
        constructor() {
            super(DtoClass, ChannelClass);
        }
        dtoToData(dto) {
            return dto.value;
        }
        update(dto) {
            const lastCurrent = this.dataStream.current;
            this.getChannelAction('UPDATE')(this.dtoToData(dto));
            return lastCurrent;
        }
        close() {
            this.getChannelAction('CLOSE')();
        }
    })();
    expect(dao.dataStream.last).toBe(undefined);
    const dto = new DtoClass('i');
    expect((await dao.update(dto)).value).toBe(dto.value);
    expect(dao.dataStream.last.value).toBe(dto.value);
    dao.close();
    expect(dao.dataStream.current).toBe(null);
    expect(dao.dataStream.last.value).toBe(dto.value);
});