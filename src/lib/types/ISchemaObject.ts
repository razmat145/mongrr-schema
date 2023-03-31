
import TMongoType from './TMongoType';
import IObjectProperties from './IObjectProperties';

interface ISchemaObject {
    bsonType: TMongoType;

    title?: string;

    properties?: IObjectProperties;

    required?: Array<keyof IObjectProperties>;

    items?: ISchemaObject
}

export default ISchemaObject;