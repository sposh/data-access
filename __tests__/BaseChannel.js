import BaseChannel from '../src/BaseChannel';

test('BaseChannel.dataStream', async () => {
    const channel = new BaseChannel();
    expect(channel.dataStream.last).toBe(undefined);
    const data = 'i';
    let current = channel.dataStream.current;
    channel._update(data);
    expect(await (current)).toBe(data);
    expect(channel.dataStream.last).toBe(data);
    channel._close();
    expect(channel.dataStream.current).toBe(null);
    expect(channel.dataStream.last).toBe(data);
});