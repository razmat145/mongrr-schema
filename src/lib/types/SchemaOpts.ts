
import ISchemaObject from './ISchemaObject';
import { IIndexDescription } from './Index';

export interface ISchemaOptIndex {
    name: string;

    index: Array<IIndexDescription>;
}

export interface ISchemaOpts {
    collectionName: string;

    schema: ISchemaObject;

    indexes?: Array<ISchemaOptIndex>;
}