
import _ from 'lodash';

import { ITypeDescription } from 'tparserr';

import Property from './util/Property';

import ISchemaObject from '../../types/ISchemaObject';
import { ISchemaOpts } from '../../types/SchemaOpts';


class Transform {

    public transform(typeDescription: ITypeDescription): Partial<ISchemaOpts> {
        return {
            schema: this.transformToSchema(typeDescription)
        };
    }

    private transformToSchema(typeDescription: ITypeDescription): ISchemaObject {
        switch (true) {
            case Property.isPrimitive(typeDescription):
                return Property.transformToPrimitiveSchema(typeDescription);

            case typeDescription.type === 'object':
                return this.transformToObjectSchema(typeDescription);

            case typeDescription.type === 'array':
                return this.transformToArraySchema(typeDescription);

            default:
                throw new Error(`Unknown or not yet implemented type description type: ${typeDescription.type}`);
        }
    }

    private transformToObjectSchema(typeDescription: ITypeDescription): ISchemaObject {
        return {
            bsonType: 'object',
            title: typeDescription?.name,
            properties: this.transformProperties(typeDescription.properties),
            required: Property.extractRequired(typeDescription.properties)
        };
    }

    private transformProperties(typeDescriptionProperties?: Record<string, ITypeDescription>): Record<string, ISchemaObject> {
        const schemaKeys = {};

        for (const key in typeDescriptionProperties) {
            _.assign(schemaKeys, {
                [key]: this.transformToSchema(typeDescriptionProperties[key])
            });
        }

        return schemaKeys;
    }

    private transformToArraySchema(typeDescription: ITypeDescription): ISchemaObject {
        const base = {
            bsonType: 'array'
        };

        if (!_.isEmpty(typeDescription.items)) {
            _.assign(base, {
                items: this.transformToSchema(typeDescription.items)
            });
        }

        return base;
    }

}

export default new Transform();