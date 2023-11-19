import { FetchChannel } from '..';
// import fetch from 'node-fetch';

// jest.mock('fetch'); // FIXME Use mock responses - throwing "require is not defined" error

test('Basic FetchChannel', async () => {
    const channel1 = new FetchChannel();
    expect((await (await channel1.get('https://api.github.com/users/sposh/repos')).json())[0].id).toBe(696815904);
    const channel2 = new FetchChannel();
    expect((await (await channel2.get('https://api.github.com/users/sposh/repos')).json())[0].id).toBe(696815904);
    expect((await (await channel1.get('https://api.github.com/users/jane/repos')).json())[0].id).toBe(112634155);
});