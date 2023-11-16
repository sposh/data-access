import BaseDto from '../src/BaseDto';
import FetchDao from '../src/FetchDao';

// FIXME Use mock responses

test('Basic FetchChannel', async () => {
    class JsonFetchDao extends FetchDao {
        async dataToDto(response) {
            return (response === undefined || response === null) ? response : new BaseDto(await response.json());
        }
    };
    const dao1 = new JsonFetchDao();
    expect(await dao1.dataStream.current).toBe(undefined);
    dao1.read('https://api.github.com/users/sposh/repos');
    expect((await dao1.dataStream.current)._params[0][0].id).toBe(696815904);
    const dao2 = new JsonFetchDao();
    expect(await dao2.dataStream.current).toBe(undefined);
    dao2.read('https://api.github.com/users/sposh/repos');
    expect((await dao2.dataStream.current)._params[0][0].id).toBe(696815904);
    dao1.read('https://api.github.com/users/jane/repos');
    expect((await dao1.dataStream.current)._params[0][0].id).toBe(112634155);
});