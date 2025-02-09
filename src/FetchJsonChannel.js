import FetchChannel from './FetchChannel.js';

export default class FetchJsonChannel extends FetchChannel {
    _update(response) {
        if (response) {
            super._update(response.json());
        }
    }
}