import { createInstance } from '@sposh/oop-utils';
import DataStream from './DataStream.js';

export default function combinedDaoMixin(baseDaoClass, combinedDtoClass) {
    return class DtoCollection extends baseDaoClass {
        _combine(dataStreams) { // FIXME No protected classes in JS
            return DataStream.combine(dataStreams, dtos => createInstance(combinedDtoClass, ...dtos));
        }
    }
}