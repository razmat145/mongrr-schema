
import _ from 'lodash';

import { ITypeDescription } from 'tparserr';

import Property from './util/Property';
import Decorator from './util/Decorator';

import ISchemaObject from '../../types/ISchemaObject';
import { ISchemaOpts, ISchemaOptIndex } from '../../types/SchemaOpts';


class Transform {

    private indexes: Array<ISchemaOptIndex> = [];

    public transform(typeDescription: ITypeDescription): Partial<ISchemaOpts> {
        this.indexes = [];

        return {
            schema: this.transformToSchema(typeDescription),
            indexes: this.indexes
        };
    }

    private transformToSchema(typeDescription: ITypeDescription, basePath = ''): ISchemaObject {
        const description = Decorator.getSingleValueIfExists(typeDescription, 'Description');

        let base;
        switch (true) {
            case Property.isPrimitive(typeDescription):
                base = Property.transformToPrimitiveSchema(typeDescription);
                break;

            case typeDescription.type === 'object':
                base = this.transformToObjectSchema(typeDescription, basePath);
                break;

            case typeDescription.type === 'array':
                base = this.transformToArraySchema(typeDescription);
                break;

            default:
                throw new Error(`Unknown or not yet implemented type description type: ${typeDescription.type}`);
        }

        description && _.assign(base, { description });

        return base;
    }

    private transformToObjectSchema(typeDescription: ITypeDescription, basePath = ''): ISchemaObject {
        return {
            bsonType: 'object',
            title: typeDescription?.name,
            properties: this.transformProperties(typeDescription.properties, basePath),
            required: Property.extractRequired(typeDescription.properties)
        };
    }

    private transformProperties(typeDescriptionProperties?: Record<string, ITypeDescription>, basePath = ''): Record<string, ISchemaObject> {
        const schemaKeys = {};

        for (const key in typeDescriptionProperties) {
            _.assign(schemaKeys, {
                [key]: this.transformToSchema(typeDescriptionProperties[key], basePath ? `${basePath}.${key}` : key)
            });

            this.extractIndexDecorators(typeDescriptionProperties[key], key, basePath);
        }

        return schemaKeys;
    }

    private extractIndexDecorators(typeDescription: ITypeDescription, key: string, basePath: string) {
        const index = Decorator.extractPropertyIndex(
            basePath ? `${basePath}.${key}` : key,
            typeDescription
        );

        if (!_.isEmpty(index)) {
            this.indexes.push({
                name: basePath ? `${basePath}.${key}` : key,
                index: [index]
            });
        }
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

        const minItems = Decorator.getSingleValueIfExists(typeDescription, 'MinItems');
        minItems && _.assign(base, { minItems });
        const maxItems = Decorator.getSingleValueIfExists(typeDescription, 'MaxItems');
        maxItems && _.assign(base, { maxItems });

        const uniqueItems = Decorator.getSingleValueIfExists(typeDescription, 'UniqueItems');
        uniqueItems && _.assign(base, { uniqueItems });

        return base;
    }

}

export default new Transform();