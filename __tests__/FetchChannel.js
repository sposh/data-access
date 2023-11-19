import { FetchChannel } from '..';
// import fetch from 'node-fetch';

// jest.mock('fetch'); // FIXME Use mock responses - throwing "require is not defined" error
// const mockId = id => fetch.mockResolvedValue(Promise.resolve({ json: () => Promise.resolve([{ id: id }]) }));

test('Basic FetchChannel', async () => {
    // mockId(696815904);
    const channel1 = new FetchChannel();
    channel1.get('https://api.github.com/users/sposh/repos');
    expect((await (await channel1.dataStream.current).json())[0].id).toBe(696815904);
    const channel2 = new FetchChannel();
    channel2.get('https://api.github.com/users/sposh/repos');
    expect((await (await channel2.dataStream.current).json())[0].id).toBe(696815904);
    // mockId(112634155);
    channel1.get('https://api.github.com/users/jane/repos');
    expect((await (await channel1.dataStream.current).json())[0].id).toBe(112634155);
});