
import Collection from './Collection';

import { ISchemaOpts } from '../../types/SchemaOpts';


class Generator {

    public async generate(schemaOpts: Array<ISchemaOpts>) {
        await Collection.loadExistingCollections();

        for (const schemaOpt of schemaOpts) {
            await Collection.createUpdateCollection(schemaOpt);
        }

        Collection.clearExistingCollections();
    }

}

export default new Generator();