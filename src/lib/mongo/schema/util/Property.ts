
import { ITypeDescription } from 'tparserr';

import Decorator from './Decorator';

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
                return this.generateNumberPrimitiveSchema(typeDescription);


            case 'Date':
                return { bsonType: 'date' };

            default:
                throw new Error(`Unknown or not yet implemented primitive type: ${typeDescription.type}`);
        }
    }

    private generateNumberPrimitiveSchema(typeDescription: ITypeDescription): ISchemaObject {
        // cases fall based on type casting as much as possible
        switch (true) {
            case Decorator.hasDecorator(typeDescription, 'Long'):
                return { bsonType: 'long' };

            case Decorator.hasDecorator(typeDescription, 'Decimal'):
                return { bsonType: 'decimal' };

            case Decorator.hasDecorator(typeDescription, 'Double'):
                return { bsonType: 'double' };

            case Decorator.hasDecorator(typeDescription, 'Int'):
                return { bsonType: 'int' };

            default:
                return { bsonType: 'number' };
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