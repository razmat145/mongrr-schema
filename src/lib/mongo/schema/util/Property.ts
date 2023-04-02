
import { ITypeDescription } from 'tparserr';

import ISchemaObject from '../../../types/ISchemaObject';


class Property {

    private parserPrimitives: Array<string> = ['string', 'Date', 'boolean', 'number'];

    public transformToPrimitiveSchema(typeDescription: ITypeDescription): ISchemaObject {
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

    public extractRequired(typeDescriptionProperties?: Record<string, ITypeDescription>): Array<string> {
        const requiredProps = [];

        for (const key in typeDescriptionProperties) {
            if (typeDescriptionProperties[key].required) {
                requiredProps.push(key);
            }
        }

        return requiredProps;
    }

    public isPrimitive(typeDescription: ITypeDescription): boolean {
        return typeDescription.type
            ? this.parserPrimitives.includes(typeDescription.type)
            : false;
    }

}

export default new Property();