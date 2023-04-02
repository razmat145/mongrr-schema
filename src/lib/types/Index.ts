
export interface IIndexDescription {
    property: string,

    direction?: TIndexDirection;
}

export type TIndexDirection = 'asc' | 'desc';

export type TMongoIndexDirection = 1 | -1;

export interface IMongoIndex {
    key: Record<string, TMongoIndexDirection>;

    name: string;
}

export type TCompoundIndexInputDefinition = [string, TIndexDirection?];