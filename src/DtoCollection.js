export default class DtoCollection extends Array {
    constructor(...dtoTuples) {
        super(dtoTuples.map(dtoTuple => new dtoTuple[0](...dtoTuple[1])));
        Object.freeze(this); // TODO Do we want this?
    }
}