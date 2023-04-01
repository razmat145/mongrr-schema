
import { ITypeDescription } from 'tparserr';

import Transform from './Transform';

import { ISchemaOpts } from '../../types/SchemaOpts';


class Builder {

    public transform(typeDescriptions: Array<ITypeDescription>): Array<ISchemaOpts> {
        const schemaOpts = [];

        for (const typeDescription of typeDescriptions) {   
            
            schemaOpts.push(Transform.transform(typeDescription));
        }

        return schemaOpts;
    }

}

export default new Builder();