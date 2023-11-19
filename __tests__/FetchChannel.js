import { FetchChannel } from '..';
// import fetch from 'node-fetch';

// jest.mock('fetch'); // FIXME Use mock responses - throwing "require is not defined" error

test('Basic FetchChannel', async () => {
    const channel1 = new FetchChannel();
    channel1.get('https://api.github.com/users/sposh/repos');
    expect((await (await channel1.dataStream.current).json())[0].id).toBe(696815904);
    const channel2 = new FetchChannel();
    channel2.get('https://api.github.com/users/sposh/repos');
    expect((await (await channel2.dataStream.current).json())[0].id).toBe(696815904);
    channel1.get('https://api.github.com/users/jane/repos');
    expect((await (await channel1.dataStream.current).json())[0].id).toBe(112634155);
});