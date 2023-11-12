import FetchChannel from "../src/FetchChannel";

// TODO Use mock responses

test('Basic FetchChannel', async () => {
    const channel1 = new FetchChannel();
    const channel2 = new FetchChannel();
    let reply1 = channel1.get('https://api.github.com/users/sposh/repos');
    const reply2 = channel2.get('https://api.github.com/users/sposh/repos');
    reply1.current.then(response => response.json()).then(data => expect(data[0].id).toBe(696815904));
    reply2.current.then(response => response.json()).then(data => expect(data[0].id).toBe(696815904));
    channel1.get('https://api.github.com/users/jane/repos');
    await reply1.current;
    reply1.current.then(response => response.json()).then(data => expect(data[0].id).toBe(112634155));
});