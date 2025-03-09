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

import { combinedDaoMixin, CrudDao, FetchJsonDao, BaseDto } from '../index.js';

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

class SposhDao extends FetchJsonDao {
    constructor(dtoClass = Sposh, channelClass, ...params) {
        super(dtoClass, channelClass, ...params);
    }
    read() {
        return super.read('https://api.github.com/users/sposh/repos');
    }
    _dataToDtoParams(data) {
        return [data[0].full_name, data[0].owner.login];
    }
}

class JaneDao extends FetchJsonDao {
    constructor(dtoClass = Jane, channelClass, ...params) {
        super(dtoClass, channelClass, ...params);
    }
    read() {
        return super.read('https://api.github.com/users/jane/repos');
    }
    _dataToDtoParams(data) {
        return [data[0].full_name, data[0].owner.login];
    }
}

class SposhAndJaneDao extends combinedDaoMixin(CrudDao, SposhAndJane) {
    #daos = { sposhDao: new SposhDao(), janeDao: new JaneDao()};
    read() {
        return this._combine([this.#daos.sposhDao.read(), this.#daos.janeDao.read()]);
    }
}

test('One from many pattern', async () => {
    expect((await (new SposhAndJaneDao()).read().current).toString()).toBe('SposhAndJane{ "sposh":Sposh{ "one":sposh/azurepoc, "two":sposh }, "jane":Jane{ "three":jane/alexa, "four":jane } }');
});

/* TODO test('Many from one pattern', async () => {
}); */

/* TODO test('Many from many pattern', async () => {
}); */