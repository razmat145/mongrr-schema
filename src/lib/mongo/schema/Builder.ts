
import _ from 'lodash';

import { ITypeDescription } from 'tparserr';

import Transform from './Transform';
import Decorator from './Decorator';

import { ISchemaOptIndex, ISchemaOpts } from '../../types/SchemaOpts';


class Builder {

    public transform(typeDescriptions: Array<ITypeDescription>): Array<ISchemaOpts> {
        const schemaOpts: Array<ISchemaOpts> = [];

        for (const typeDescription of typeDescriptions) {
            const { schema, indexes } = Transform.transform(typeDescription);

            const collectionName = this.extractCollectionName(typeDescription);
            const collectionSchemaOpts = {
                collectionName,
                schema
            };

            if (!_.isEmpty(indexes)) {
                _.assign(collectionSchemaOpts, {
                    indexes: this.prepareIndexes(collectionName, indexes)
                });
            }

            schemaOpts.push(collectionSchemaOpts);
        }

        return schemaOpts;
    }

    private extractCollectionName(typeDescription: ITypeDescription): string {
        const userEnforcedName = Decorator.extractDecoratedCollectionName(typeDescription);

        return userEnforcedName || typeDescription.name;
    }

    private prepareIndexes(collectionName: string, indexes: ISchemaOptIndex[]) {
        return _.map(indexes, indexDef => {
            indexDef.name = `${collectionName}_${indexDef.name}`;
            return indexDef;
        });
    }

}

export default new Builder();