import { FetchJsonDao } from '..';
// import fetch from 'node-fetch';

// jest.mock('fetch'); // FIXME Use mock responses - throwing "require is not defined" error

test('Basic FetchJsonDao', async () => {
    const dao1 = new FetchJsonDao();
    dao1.read('https://api.github.com/users/sposh/repos');
    expect((await dao1.dataStream.current)._params[0][0].id).toBe(696815904);
    const dao2 = new FetchJsonDao();
    dao2.read('https://api.github.com/users/sposh/repos');
    expect((await dao2.dataStream.current)._params[0][0].id).toBe(696815904);
    dao1.read('https://api.github.com/users/jane/repos');
    expect((await dao1.dataStream.current)._params[0][0].id).toBe(112634155);
});