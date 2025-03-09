import { FetchJsonDao } from '../index.js';
// import fetch from 'node-fetch';

// jest.mock('fetch'); // FIXME Use mock responses - throwing "require is not defined" error

test('Basic FetchJsonDao', async () => {
    const dao1 = new FetchJsonDao();
    expect((await dao1.read('https://api.github.com/users/sposh/repos').current)._params[0][0].id).toBe(696815904);
    const dao2 = new FetchJsonDao();
    expect((await dao2.read('https://api.github.com/users/sposh/repos').current)._params[0][0].id).toBe(696815904);
    expect((await dao1.read('https://api.github.com/users/jane/repos').current)._params[0][0].id).toBe(112634155);
});