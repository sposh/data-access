import DataStream from '../src/DataStream';

test('Basic DataStream', async () => {
    let refresh, end;
    const dataStream = new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
    expect(dataStream.last).toBe(undefined);
    const value = 'i';
    let current = dataStream.current;
    refresh(value);
    expect(await current).toBe(value);
    expect(dataStream.last).toBe(value);
    current = dataStream.current;
    refresh(value + value);
    expect(await current).toBe(value + value);
    expect(dataStream.last).toBe(value + value);
    end();
    expect(dataStream.last).toBe(value + value);
    expect(dataStream.current).toBe(null);
});


test('DataStream outputFilter', async () => {
    let refresh, end;
    const dataStream = (new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup)).addOutputFilter(data => data ? data + data : data);
    expect(dataStream.last).toBe(undefined);
    const value = 'i';
    let current = dataStream.current;
    refresh(value);
    expect(await current).toBe(value + value);
    expect(dataStream.last).toBe(value + value);
    end();
    expect(dataStream.last).toBe(value + value);
    expect(dataStream.current).toBe(null);
});

test('DataStream iteration', async () => {
    let refresh, end;
    const dataStream = new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
    expect(dataStream.last).toBe(undefined);
    const values = [1, 2, 3, 4, 5];
    let i = 0;
    (async () => {
        for await (const data of dataStream) {
            expect(data).toBe(values[i]);
            i++;
        }
    })();
    /* FIXME Change data refresh to this, but for some reason we send 3 refreshes per iterator yield
    for (let vi = 0; vi < values.length; vi += 1) { // send data values
        const current = dataStream.current;
        refresh(values[vi]);
        expect(await current).toBe(values[vi]);
    } */
    await new Promise(resolve => { // send data updates every 10ms
        for (let vi = 0; vi < values.length - 1; vi += 1) { // send all except last data values
            setTimeout(() => {refresh(values[vi]);}, (vi + 1) * 10);
        }
        // send last data value and resolve Promise
        setTimeout(() => {refresh(values[values.length - 1]); resolve();}, values.length * 10);
    });
    expect(dataStream.last).toBe(values[values.length - 1]);
    end();
    expect(dataStream.last).toBe(values[values.length - 1]);
    expect(dataStream.current).toBe(null);
    expect(i).toBe(values.length - 1);
});

test('DataStream chaining', async () => {
    let refresh, end;
    const dataStream = new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
    const chainedDataStream = dataStream.createLinkedDataStream().addOutputFilter(data => data ? data + data : data);
    expect(dataStream.last).toBe(undefined);
    expect(chainedDataStream.last).toBe(undefined);
    const values = [1, 2, 3, 4, 5];
    let i = 0;
    (async () => {
        for await (const data of dataStream) {
            expect(data).toBe(values[i]);
            i++;
        }
    })();
    let j = 0;
    (async () => {
        for await (const data of chainedDataStream) {
            expect(data).toBe(values[j] + values[j]);
            j++;
        }
    })();
    /* FIXME Change data refresh to this, but for some reason we send 3 refreshes per iterator yield
    for (let vi = 0; vi < values.length; vi += 1) { // send data values
        const current = dataStream.current;
        refresh(values[vi]);
        expect(await current).toBe(values[vi]);
    } */
    await new Promise(resolve => { // send data updates every 10ms
        for (let vi = 0; vi < values.length - 1; vi += 1) { // send all except last data values
            setTimeout(() => {refresh(values[vi]);}, (vi + 1) * 10);
        }
        // send last data value and resolve Promise
        setTimeout(() => {refresh(values[values.length - 1]); resolve();}, values.length * 10);
    });
    expect(dataStream.last).toBe(values[values.length - 1]);
    expect(chainedDataStream.last).toBe(values[values.length - 1] + values[values.length - 1]);
    end();
    expect(dataStream.last).toBe(values[values.length - 1]);
    expect(chainedDataStream.last).toBe(values[values.length - 1] + values[values.length - 1]);
    expect(dataStream.current).toBe(null);
    expect(chainedDataStream.current).toBe(null);
    expect(i).toBe(values.length - 1);
    expect(j).toBe(values.length - 1);
});