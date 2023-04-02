
import _ from 'lodash';

import Collection from './Collection';
import Index from './Index';

import { ISchemaOpts } from '../../types/SchemaOpts';


class Generator {

    public async generate(schemaOpts: Array<ISchemaOpts>) {
        await Collection.loadExistingCollections();

        for (const schemaOpt of schemaOpts) {
            await Collection.createUpdateCollection(schemaOpt);

            await this.setupCollectionIndexes(schemaOpt)
        }

        Collection.clearExistingCollections();
    }

    private async setupCollectionIndexes(schemaOpt: ISchemaOpts) {
        if (!_.isEmpty(schemaOpt.indexes)) {
            const colletionName = schemaOpt.collectionName;

            await Index.loadExistingIndexes(colletionName);

            for (const index of schemaOpt.indexes) {
                await Index.createCollectionIndex(index);
            }

            Index.clearExistingIndexes();
        }
    }

}

export default new Generator();