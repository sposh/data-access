import { BaseDao, BaseChannel, BaseDto } from '../index.js';

test('Basic BaseDao', async () => {
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
            super(DtoClass);
        }
        dtoToData(dto) {
            return dto.value;
        }
        update(dto) {
            this.getChannelAction('UPDATE')(this.dtoToData(dto));
            return this.dataStream.current;
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