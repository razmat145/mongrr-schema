
import { ITypeDescription } from 'tparserr';

import Transform from './Transform';
import Decorator from './Decorator';

import { ISchemaOpts } from '../../types/SchemaOpts';


class Builder {

    public transform(typeDescriptions: Array<ITypeDescription>): Array<ISchemaOpts> {
        const schemaOpts: Array<ISchemaOpts> = [];

        for (const typeDescription of typeDescriptions) {
            const { schema } = Transform.transform(typeDescription);

            schemaOpts.push({
                collectionName: this.extractCollectionName(typeDescription),
                schema
            });
        }

        return schemaOpts;
    }

    private extractCollectionName(typeDescription: ITypeDescription): string {
        const userEnforcedName = Decorator.extractDecoratedCollectionName(typeDescription);

        return userEnforcedName || typeDescription.name;
    }

}

export default new Builder();