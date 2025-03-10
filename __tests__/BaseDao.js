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
    class ChannelClass extends BaseChannel {
        async doubleUpdate(callback, _params, data) {
            callback(`${await data}`);
            callback(`${await data}${await data}`);
        }
    };
    const dao = new (class MyDao extends BaseDao {
        constructor() {
            super(DtoClass, ChannelClass);
        }
        _dtoToData(dto) {
            return dto.value;
        }
        _dataToDtoParams(...data) {
            return data;
        }
        update(dto) {
            return this.__exec__('doubleUpdate', null, dto);
        }
    })();
    const dto = new DtoClass('i');
    const dataStream = dao.update(dto);
    expect(dataStream.last).toBe(undefined);
    expect((await dataStream.current).value).toBe(dto.value);
    expect(dataStream.last.value).toBe(dto.value);
    expect((await dataStream.current).value).toBe(`${dto.value}${dto.value}`);
    expect(dataStream.last.value).toBe(`${dto.value}${dto.value}`);
    // TODO Uncomment when we add dao.end
    // dao.close();
    // expect(dataStream.current).toBe(null);
    // expect(dataStream.last.value).toBe(dto.value);
}); // TODO test single/multiple datastream concurrency