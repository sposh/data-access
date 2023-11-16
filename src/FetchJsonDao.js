import FetchDao from './FetchDao';

// TODO More tests, JSDocs

export default class FetchJsonDao extends FetchDao {
    async dataToDto(response) {
        return (response === undefined || response === null) ? response : super.dataToDto(await response.json());
    }
}