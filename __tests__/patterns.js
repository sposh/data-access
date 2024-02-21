/**
 * TODO
 * 
 * - manyIndependentFromOne
 *   - singleton + debounce
 *   - cache + ttl
 *     - persistend with encryption & erasing
 * - manyToMany orchestration / transformation; GraphQL-ish & HATEOAS
 * - cf event-driven, hexagonal & repository pattern
 * - Imporove usage doc
 */

import { combinedDaoMixin, FetchJsonDao, BaseDto, DtoCollection } from '..';

// import fetch from 'node-fetch';

// jest.mock('fetch'); // FIXME Use mock responses - throwing "require is not defined" error

class Sposh extends BaseDto {
    #one;
    #two;
    constructor(one, two) {
        super(one, two);
        this.#one = one;
        this.#two = two;
    }
    get one() {
        return this.toInmutable(this.#one);
    }
    get two() {
        return this.toInmutable(this.#two);
    }
}

class Jane extends BaseDto {
    #three;
    #four;
    constructor(three, four) {
        super(three, four);
        this.#three = three;
        this.#four = four;
    }
    get three() {
        return this.toInmutable(this.#three);
    }
    get four() {
        return this.toInmutable(this.#four);
    }
}

class SposhAndJane extends BaseDto {
    #sposh;
    #jane;
    constructor(sposh, jane) {
        super(sposh, jane);
        this.#sposh = sposh;
        this.#jane = jane;
    }
    get sposh() {
        return this.toInmutable(this.#sposh);
    }
    get jane() {
        return this.toInmutable(this.#jane);
    }
}

class Sposh2 extends BaseDto {
    #five;
    #six;
    constructor(five, six) {
        super(five, six);
        this.#five = five;
        this.#six = six;
    }
    get five() {
        return this.toInmutable(this.#five);
    }
    get six() {
        return this.toInmutable(this.#six);
    }
}

class Spane extends BaseDto {
    #one;
    #three;
    constructor(one, three) {
        super(one, three);
        this.#one = one;
        this.#three = three;
    }
    get one() {
        return this.toInmutable(this.#one);
    }
    get three() {
        return this.toInmutable(this.#three);
    }
}

class Jaish extends BaseDto {
    #two;
    #four;
    constructor(two, four) {
        super(two, four);
        this.#two = two;
        this.#four = four;
    }
    get two() {
        return this.toInmutable(this.#two);
    }
    get four() {
        return this.toInmutable(this.#four);
    }
}

class SposhDao extends FetchJsonDao {
    constructor() {
        super(null);
    }
    read() {
        return super.read('https://api.github.com/users/sposh/repos');
    }
}

class SposhComposedDao extends FetchJsonDao {
    constructor(dtoClass = Sposh, channelClass, ...params) {
        super(dtoClass, channelClass, ...params);
    }
    read() {
        return super.read('https://api.github.com/users/sposh/repos');
    }
    async dataToDtoParams(response) {
        const json = (await super.dataToDtoParams(response))[0];
        return [json[0].full_name, json[0].owner.login];
    }
}

class JaneDao extends FetchJsonDao {
    constructor() {
        super(null);
    }
    read() {
        return super.read('https://api.github.com/users/jane/repos');
    }
}

class JaneComposedDao extends FetchJsonDao {
    constructor(dtoClass = Jane, channelClass, ...params) {
        super(dtoClass, channelClass, ...params);
    }
    read() {
        return super.read('https://api.github.com/users/jane/repos');
    }
    async dataToDtoParams(response) {
        const json = (await super.dataToDtoParams(response))[0];
        return [json[0].full_name, json[0].owner.login];
    }
}

class OneFromManyDao extends combinedDaoMixin(FetchJsonDao, SposhAndJane, [new SposhDao(), new JaneDao()]) {
    async read() {
        this.daoList.forEach(dao => dao.read());
        return this.dataStream.current;
    }
    async dataToDtoParams(dataPromise) {
        const params = await dataPromise;
        return [{ one: params[0][0][0].full_name, two: params[0][0][0].owner.login }, { three: params[1][0][0].full_name, four: params[1][0][0].owner.login }];
    }
}

class OneComposedFromManyDao extends combinedDaoMixin(FetchJsonDao, SposhAndJane, [new SposhComposedDao(), new JaneComposedDao()]) {
    read() {
        this.daoList.forEach(dao => dao.read());
        return this.dataStream.current;
    }
    async dataToDtoParams(dataPromise) {
        const params = await dataPromise;
        return [params[0], params[1]];
    }
}

class ManyFromOneDao extends FetchJsonDao {
    constructor(dtoClass = DtoCollection, channelClass, ...params) {
        super(dtoClass, channelClass, ...params);
    }
    read() {
        return super.read('https://api.github.com/users/sposh/repos');
    }
    async dataToDtoParams(response) {
        const json = (await super.dataToDtoParams(response))[0];
        return [[Sposh, [json[0].full_name, json[0].owner.login]], [Sposh2, [json[0].id, json[0].owner.id]]];
    }
}
/*
test('One from many pattern', async () => {
    const sposhAndJane = await (new OneFromManyDao()).read();
    expect(sposhAndJane.toString()).toBe('SposhAndJane{ sposh: [object Object], jane: [object Object] }');
    expect(sposhAndJane.sposh.one).toBe('sposh/azurepoc');
    expect(sposhAndJane.sposh.two).toBe('sposh');
    expect(sposhAndJane.jane.three).toBe('jane/alexa');
    expect(sposhAndJane.jane.four).toBe('jane');
});

test('One (composed) from many pattern', async () => {
    expect((await (new OneComposedFromManyDao()).read()).toString()).toBe('SposhAndJane{ sposh: Sposh{ one: sposh/azurepoc, two: sposh }, jane: Jane{ three: jane/alexa, four: jane } }');
}); */

test('Many from one pattern', async () => {
    expect((await (new ManyFromOneDao()).read()).toString()).toBe('Sposh{ "one":sposh/azurepoc, "two":sposh },Sposh2{ "five":696815904, "six":13214484 }');
});