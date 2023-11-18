import BaseDao from '../src/BaseDao';
import BaseChannel from '../src/BaseChannel';
import BaseDto from '../src/BaseDto';

test('BaseDao.dataStream', async () => {
    class ChannelClass extends BaseChannel {
        static get actions() {
            return { UPDATE: 'update', CLOSE: 'close' };
        }
        update(data) {
            this._update(data);
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
            this.getChannelAction('UPDATE')(this.dtoToData(dto));
        }
        close() {
            this.getChannelAction('CLOSE')();
        }
    })();
    expect(dao.dataStream.last).toBe(undefined);
    const dto = new DtoClass('i');
    const current = dao.dataStream.current;
    dao.update(dto);
    expect((await current).value).toBe(dto.value);
    expect(dao.dataStream.last.value).toBe(dto.value);
    dao.close();
    // FIXME (need to chain streams) expect(dao.dataStream.current).toBe(null);
    expect(dao.dataStream.last.value).toBe(dto.value);
});