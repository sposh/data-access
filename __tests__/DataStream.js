import DataStream from "../src/DataStream";

test('Basic DataStream', () => {
    let refresh, end;
    const dataStream = new DataStream(refreshSetup => refresh = refreshSetup, endSetup => end = endSetup);
    expect(dataStream.last).toBe(undefined);
    refresh('i');
    expect(dataStream.last).toBe('i');
});