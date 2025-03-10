import { FetchChannel } from '../index.js';
// import fetch from 'node-fetch';

// jest.mock('fetch'); // FIXME Use mock responses - throwing "require is not defined" error

async function fetchCallback(responsePromise, id) {
  expect((await (await responsePromise).json())[0].id).toBe(id);
}

test('Basic FetchChannel', async () => {
    const channel1 = new FetchChannel();
    channel1.get(response => fetchCallback(response, 696815904), { url: 'https://api.github.com/users/sposh/repos' });
    const channel2 = new FetchChannel();
    channel2.get(response => fetchCallback(response, 696815904), { url: 'https://api.github.com/users/sposh/repos' });
    channel1.get(response => fetchCallback(response, 112634155), { url: 'https://api.github.com/users/jane/repos' });
});
