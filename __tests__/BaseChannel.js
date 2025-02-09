import { BaseChannel } from '../index.js';

test('Basic BaseChannel', async () => {
    const channel = new BaseChannel();
    expect(channel.dataStream.last).toBe(undefined);
    const data = 'i';
    channel._update(data);
    expect(channel.dataStream.last).toBe(data);
    channel._close();
    expect(channel.dataStream.current).toBe(null);
    expect(channel.dataStream.last).toBe(data);
});