
import _ from 'lodash';

import { ITypeDescription } from 'tparserr';

import Property from './util/Property';
import Decorator from './Decorator';

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
        switch (true) {
            case Property.isPrimitive(typeDescription):
                return Property.transformToPrimitiveSchema(typeDescription);

            case typeDescription.type === 'object':
                return this.transformToObjectSchema(typeDescription, basePath);

            case typeDescription.type === 'array':
                return this.transformToArraySchema(typeDescription);

            default:
                throw new Error(`Unknown or not yet implemented type description type: ${typeDescription.type}`);
        }
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
        const index = Decorator.extractPropertyIndexDecorators(
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

        return base;
    }

}

export default new Transform();