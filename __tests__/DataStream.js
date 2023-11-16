import DataStream from '../src/DataStream';

test('Basic DataStream', () => {
    let refresh, end;
    const dataStream = new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
    expect(dataStream.last).toBe(undefined);
    refresh('i');
    expect(dataStream.last).toBe('i');
});

test('DataStream iteration', async () => {
    let refresh, end;
    const dataStream = new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
    expect(dataStream.last).toBe(undefined);
    const values = [undefined, 1, 2, 3, null];
    let i = 0;
    (async () => {
        for await (const data of dataStream) {
            expect(data).toBe(values[i]);
            i++;
        }
    })();
    for (const vi of values.slice(1, -1)) {
        await (new Promise(resolve => setTimeout(resolve, 10))); // Small pause to simulate async refresh events
        refresh(values[vi]);
    }
    await (new Promise(resolve => setTimeout(resolve, 10))); // Small pause to allow for last event to be processed
    end();
    expect(i).toBe(4);
});