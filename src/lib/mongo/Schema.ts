
import _ from 'lodash';

import { ITypeDescription } from 'tparserr';

import ISchemaObject from '../types/ISchemaObject';


class Schema {

    private parserPrimitives: Array<string> = ['string', 'Date', 'boolean', 'number'];

    public transform(typeDescriptions: Array<ITypeDescription>): Array<ISchemaObject> {
        const schema = [];

        for (const typeDescription of typeDescriptions) {
            schema.push(this.transformToSchema(typeDescription));
        }

        return schema;
    }

    private transformToSchema(typeDescription: ITypeDescription): ISchemaObject {
        switch (true) {
            case this.isPrimitive(typeDescription):
                return this.transformToPrimitiveSchema(typeDescription);

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
            required: this.extractRequiredProperties(typeDescription.properties)
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

    private extractRequiredProperties(typeDescriptionProperties?: Record<string, ITypeDescription>): Array<string> {
        const requiredProps = [];

        for (const key in typeDescriptionProperties) {
            if (typeDescriptionProperties[key].required) {
                requiredProps.push(key);
            }
        }

        return requiredProps;
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

    private transformToPrimitiveSchema(typeDescription: ITypeDescription): ISchemaObject {
        switch (typeDescription.type) {
            case 'boolean':
                return { bsonType: 'bool' };

            case 'string':
                return { bsonType: 'string' };

            case 'number':
                return { bsonType: 'number' };

            case 'Date':
                return { bsonType: 'date' };

            default:
                throw new Error(`Unknown or not yet implemented primitive type: ${typeDescription.type}`);
        }
    }

    private isPrimitive(typeDescription: ITypeDescription) {
        return typeDescription.type
            ? this.parserPrimitives.includes(typeDescription.type)
            : false;
    }

}

export default new Schema();