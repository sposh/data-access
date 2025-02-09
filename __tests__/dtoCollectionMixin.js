import { BaseDto, dtoCollectionMixin } from '../index.js';

test('Null dtoCollectionMixin', () => {
    const baseDtos = new (dtoCollectionMixin(BaseDto))();
    expect(baseDtos.toString()).toBe('DtoCollection[]');
    expect(baseDtos.length).toBe(0);
});

test('Empty dtoCollectionMixin', () => {
    const baseDtos = new (dtoCollectionMixin(BaseDto))([]);
    expect(baseDtos.toString()).toBe('DtoCollection[]');
    expect(baseDtos.length).toBe(0);
});

test('Undefined dtoCollectionMixin', () => {
    const baseDtos = new (dtoCollectionMixin(BaseDto))([undefined]);
    expect(baseDtos.toString()).toBe('DtoCollection[BaseDto{  }]');
    expect(baseDtos.length).toBe(1);
    expect(baseDtos[0].toString()).toBe('BaseDto{  }');
    expect(baseDtos[0]._params).toEqual([undefined]);
});

test('Multiple values dtoCollectionMixin', () => {
    const baseDtos = new (dtoCollectionMixin(BaseDto))([1, 2]);
    expect(baseDtos.toString()).toBe('DtoCollection[BaseDto{  },BaseDto{  }]');
    expect(baseDtos.length).toBe(2);
    expect(baseDtos[0].toString()).toBe('BaseDto{  }');
    expect(baseDtos[0]._params).toEqual([1]);
    expect(baseDtos[1]._params).toEqual([2]);
});

test('Child strings in dtoCollectionMixin', () => {
    const baseDtos = new (dtoCollectionMixin(class MyDto extends BaseDto {
        constructor(param) {
            super(param);
            this.a = param;
        }
    }))([1]);
    expect(baseDtos.toString()).toBe('DtoCollection[MyDto{ "a":1 }]');
});

test('Children strings in dtoCollectionMixin', () => {
    const baseDtos = new (dtoCollectionMixin(class MyDto extends BaseDto {
        constructor(param) {
            super(param);
            this.a = param;
        }
    }))([1, 2]);
    expect(baseDtos.toString()).toBe('DtoCollection[MyDto{ "a":1 },MyDto{ "a":2 }]');
});

test('Child strings with multiple values in dtoCollectionMixin', () => {
    const baseDtos = new (dtoCollectionMixin(class MyDto extends BaseDto {
        constructor(param1, param2) {
            super(param1, param2);
            this.a = param1;
            this.b = param2;
        }
    }))([[1, 2]]);
    expect(baseDtos.toString()).toBe('DtoCollection[MyDto{ "a":1,"b":2 }]');
});