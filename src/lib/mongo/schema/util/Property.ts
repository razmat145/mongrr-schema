
import _ from 'lodash';

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
                return this.generateStringPrimitiveSchema(typeDescription);

            case 'number':
                return this.generateNumberPrimitiveSchema(typeDescription);

            case 'Date':
                return { bsonType: 'date' };

            default:
                throw new Error(`Unknown or not yet implemented primitive type: ${typeDescription.type}`);
        }
    }

    private generateStringPrimitiveSchema(typeDescription: ITypeDescription): ISchemaObject {

        const baseSchemaObject = this.extractBaseStringSchema();
        const modifiers = this.extractStringModifiers(typeDescription);

        return !_.isEmpty(modifiers)
            ? _.assign(baseSchemaObject, modifiers)
            : baseSchemaObject;
    }

    private extractBaseStringSchema(): ISchemaObject {
        switch (true) {
            //
            // case Decorator.hasDecorator(typeDescription, 'Uuid'):
            //     return { bsonType: 'uuid' };

            default:
                return { bsonType: 'string' };
        }
    }

    private extractStringModifiers(typeDescription: ITypeDescription) {
        const modifiers = {};

        const minLengthModifier = Decorator.getSingleValueIfExists(typeDescription, 'MinLength');
        _.isNumber(minLengthModifier) && _.assign(modifiers, {
            minLength: minLengthModifier
        });

        const maxLengthModifier = Decorator.getSingleValueIfExists(typeDescription, 'MaxLength');
        _.isNumber(maxLengthModifier) && _.assign(modifiers, {
            maxLength: maxLengthModifier
        });

        return modifiers;
    }

    private generateNumberPrimitiveSchema(typeDescription: ITypeDescription): ISchemaObject {

        const baseSchemaObject = this.extractBaseNumberSchema(typeDescription);
        const modifiers = this.extractNumberModifiers(typeDescription);

        return !_.isEmpty(modifiers)
            ? _.assign(baseSchemaObject, modifiers)
            : baseSchemaObject;
    }

    private extractBaseNumberSchema(typeDescription: ITypeDescription) {
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

    private extractNumberModifiers(typeDescription: ITypeDescription) {
        const modifiers = {};

        const minimumModifier = Decorator.getSingleValueIfExists(typeDescription, 'Minimum');
        _.isNumber(minimumModifier) && _.assign(modifiers, {
            minimum: minimumModifier
        });

        const maximumModifier = Decorator.getSingleValueIfExists(typeDescription, 'Maximum');
        _.isNumber(maximumModifier) && _.assign(modifiers, {
            maximum: maximumModifier
        });

        return modifiers;
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