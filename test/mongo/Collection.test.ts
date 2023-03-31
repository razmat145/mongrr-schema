
import { describe, it, jest, expect, afterEach } from '@jest/globals';

import Collection from '../../src/lib/mongo/Collection';
import Session from '../../src/lib/util/Session';

import ISchemaObject from '../../src/lib/types/ISchemaObject';

jest.mock('../../src/lib/util/Session');

const mockedSessionGetDatabase = <jest.Mock>Session.getDatabase;

const mockListCollections = jest.fn<() => Promise<Array<{ name: string }>>>();
const mockCommand = jest.fn();
const mockCreateCollection = jest.fn();
const mockMongoDatabase = {
    listCollections: () => ({ toArray: mockListCollections }),
    createCollection: mockCreateCollection,
    command: mockCommand,
};

describe('mongo.Collection', () => {

    const mockUserSchema: ISchemaObject = {
        title: 'User',
        bsonType: 'object',
        properties: {
            a: { bsonType: 'string' }
        }
    };
    const mockEstateSchema: ISchemaObject = {
        title: 'Estate',
        bsonType: 'object',
        properties: {
            a: { bsonType: 'number' }
        }
    };
    const mockListedCollections = [{ name: 'User' }, { name: 'Estate' }];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call to generate all the collections when none exist', async () => {

        mockedSessionGetDatabase.mockReturnValue(mockMongoDatabase);
        mockListCollections.mockResolvedValue([]);

        await Collection.generate([mockUserSchema, mockEstateSchema]);

        expect(mockedSessionGetDatabase).toHaveBeenCalledTimes(3);

        expect(mockCreateCollection).toHaveBeenCalledTimes(2);
        expect(mockCreateCollection).toHaveBeenNthCalledWith(1,
            mockUserSchema.title,
            { validator: { $jsonSchema: mockUserSchema } }
        );
        expect(mockCreateCollection).toHaveBeenNthCalledWith(2,
            mockEstateSchema.title,
            { validator: { $jsonSchema: mockEstateSchema } }
        );
    });

    it('should call to update all the collections when all exist', async () => {

        mockedSessionGetDatabase.mockReturnValue(mockMongoDatabase);
        mockListCollections.mockResolvedValue(mockListedCollections);

        await Collection.generate([mockUserSchema, mockEstateSchema]);

        expect(mockedSessionGetDatabase).toHaveBeenCalledTimes(3);

        expect(mockCommand).toHaveBeenCalledTimes(2);
        expect(mockCommand).toHaveBeenNthCalledWith(1,
            {
                collMod: mockUserSchema.title,
                validator: { $jsonSchema: mockUserSchema }
            }
        );
        expect(mockCommand).toHaveBeenNthCalledWith(2,
            {
                collMod: mockEstateSchema.title,
                validator: { $jsonSchema: mockEstateSchema }
            }
        );
    });

    it('should call to create/update collections based on their existance', async () => {

        mockedSessionGetDatabase.mockReturnValue(mockMongoDatabase);
        mockListCollections.mockResolvedValue([mockListedCollections[0]]);

        await Collection.generate([mockUserSchema, mockEstateSchema]);

        expect(mockedSessionGetDatabase).toHaveBeenCalledTimes(3);

        expect(mockCommand).toHaveBeenCalledTimes(1);
        expect(mockCommand).toHaveBeenCalledWith(
            {
                collMod: mockUserSchema.title,
                validator: { $jsonSchema: mockUserSchema }
            }
        );

        expect(mockCreateCollection).toHaveBeenCalledTimes(1);
        expect(mockCreateCollection).toHaveBeenCalledWith(
            mockEstateSchema.title,
            { validator: { $jsonSchema: mockEstateSchema } }
        );
    });

});
