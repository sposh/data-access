import BaseDao from '../src/BaseDao';
import BaseChannel from '../src/BaseChannel';
import BaseDto from '../src/BaseDto';

test('BaseDao.dataStream', async () => {
    class ChannelClass extends BaseChannel {
        static get actions() {
            return { UPDATE: 'update' };
        }
        update(data) {
            this._update(data);
        }
    };
    const channel = new ChannelClass();
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
            return this.dataStream;
        }
    })();
    expect(await (dao.dataStream.current)).toBe(undefined);
    expect(dao.dataStream.last).toBe(undefined);
    const dto = new DtoClass('i');
    dao.update(dto);
    expect((await (dao.dataStream.current)).value).toBe(dto.value);
    expect(dao.dataStream.last.value).toBe(dto.value);
});