import { MedKlein } from './medklein.model';

/**
 * Datenmodell zur Liste an Medikamenten eines Users
 */
export class MedList {

    medList: [MedKlein];

    constructor() {

    }

    getMedList() :[MedKlein] {
        return this.medList;
    }

}