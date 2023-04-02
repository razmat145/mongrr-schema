
import _ from 'lodash';

import Session from '../../util/Session';

import { ISchemaOptIndex } from '../../types/SchemaOpts';
import { IMongoIndex, TMongoIndexDirection } from '../../types/Index';


class Index {

    private existingIndexes: Array<IMongoIndex> = [];

    private collectionName: string = null;

    public async createCollectionIndex(indexOpt: ISchemaOptIndex) {
        const { name } = indexOpt;
        const mongoIndexDescription = this.transformOptToMongoIndex(indexOpt);

        const doesIndexExist = this.doesIndexExist(name, mongoIndexDescription);

        if (!doesIndexExist) {
            await this.createIndex(name, mongoIndexDescription);
        }
    }

    private async createIndex(indexName: string, indexDescription: Record<string, TMongoIndexDirection>) {
        try {
            await Session.getDatabase().collection(this.collectionName).createIndex(
                indexDescription,
                { name: indexName }
            );
        } catch (err) {
            throw new Error(`Error while creating ${indexName} index for collection: ${this.collectionName}; with message: ${err.message}`);
        }
    }

    public async loadExistingIndexes(collectionName: string) {
        this.collectionName = collectionName;
        try {
            this.existingIndexes = await Session.getDatabase().collection(this.collectionName).listIndexes().toArray();
        } catch (err) {
            throw new Error(`Cannot get existing collection indexes for collection: ${collectionName}; with message: ${err.message}`);
        }
    }

    public clearExistingIndexes() {
        this.collectionName = null
        this.existingIndexes = [];
    }

    private transformOptToMongoIndex(indexOpt: ISchemaOptIndex): Record<string, TMongoIndexDirection> {
        const mongoIndexInstructions = {};

        for (const indexDef of indexOpt.index) {
            _.assign(mongoIndexInstructions, {
                [indexDef.property]: indexDef.direction === 'asc' ? 1 : -1
            });
        }

        return mongoIndexInstructions;
    }

    private doesIndexExist(indexName: string, indexDescription: Record<string, TMongoIndexDirection>) {
        const doesNameExist = _.find(this.existingIndexes, exIn => exIn.name === indexName);
        if (!_.isEmpty(doesNameExist)) {
            return true;
        }

        const doSettingsExist = _.find(this.existingIndexes, exIn => _.isEqual(exIn.key, indexDescription));
        if (!_.isEmpty(doSettingsExist)) {
            return true;
        }

        return false;
    }

}

export default new Index();