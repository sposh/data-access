import FetchJsonDao from '../src/FetchJsonDao';
// import fetch from 'node-fetch';

// jest.mock('fetch'); // FIXME Use mock responses - throwing "require is not defined" error
// const mockId = id => fetch.mockResolvedValue(Promise.resolve({ json: () => Promise.resolve([{ id: id }]) }));

test('Basic FetchJsonDao', async () => {
    // mockId(696815904);
    const dao1 = new FetchJsonDao();
    dao1.read('https://api.github.com/users/sposh/repos');
    expect((await dao1.dataStream.current)._params[0][0].id).toBe(696815904);
    const dao2 = new FetchJsonDao();
    dao2.read('https://api.github.com/users/sposh/repos');
    expect((await dao2.dataStream.current)._params[0][0].id).toBe(696815904);
    // mockId(112634155);
    dao1.read('https://api.github.com/users/jane/repos');
    expect((await dao1.dataStream.current)._params[0][0].id).toBe(112634155);
});