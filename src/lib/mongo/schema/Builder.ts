
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

            const compoundIndexes = this.extractCompoundIndexes(collectionName, typeDescription);
            if (!_.isEmpty(indexes) || !_.isEmpty(compoundIndexes)) {
                let allIndexes = [];

                if (!_.isEmpty(indexes)) {
                    allIndexes = [...this.prepareIndexes(collectionName, indexes)];
                }
                if (!_.isEmpty(compoundIndexes)) {
                    allIndexes = [...allIndexes, ...compoundIndexes];
                }

                _.assign(collectionSchemaOpts, {
                    indexes: allIndexes
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

    private extractCompoundIndexes(collectionName: string, typeDescription: ITypeDescription) {
        const compountIndexes = Decorator.extractCompoundIndexes(collectionName, typeDescription);

        return !_.isEmpty(compountIndexes) ? compountIndexes : null;
    }

    private prepareIndexes(collectionName: string, indexes: ISchemaOptIndex[]) {
        return _.map(indexes, indexDef => {
            indexDef.name = `${collectionName}_${indexDef.name}`;
            return indexDef;
        });
    }

}

export default new Builder();