
import { describe, it, jest, expect, afterEach } from '@jest/globals';

import Collection from '../../../src/lib/mongo/database/Collection';
import Session from '../../../src/lib/util/Session';

import { ISchemaOpts } from '../../../src/lib/types/SchemaOpts';

jest.mock('../../../src/lib/util/Session');

const mockedSessionGetDatabase = <jest.Mock>Session.getDatabase;

const mockListCollections = jest.fn<() => Promise<Array<{ name: string }>>>();
const mockCommand = jest.fn();
const mockCreateCollection = jest.fn();
const mockMongoDatabase = {
    listCollections: () => ({ toArray: mockListCollections }),
    createCollection: mockCreateCollection,
    command: mockCommand,
};

describe('mongo.database.Collection', () => {

    const mockUserSchemaOpts: ISchemaOpts = {
        collectionName: 'MyUser',
        schema: {
            title: 'User',
            bsonType: 'object',
            properties: {
                a: { bsonType: 'string' }
            }
        }
    };
    const mockListedCollections = [{ name: 'MyUser' }];

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initialisation', () => {

        it('should load and clear the existing collections via the util methods', async () => {

            mockedSessionGetDatabase.mockReturnValue(mockMongoDatabase);
            mockListCollections.mockResolvedValue(mockListedCollections);

            await Collection.loadExistingCollections();

            expect(mockListCollections).toHaveBeenCalled();
            expect(Collection['existingCollections']).toEqual(mockListedCollections);

            Collection.clearExistingCollections();

            expect(Collection['existingCollections']).toEqual([]);
        });

    });

    describe('createUpdateCollection', () => {

        it('should call to create the collection if it does not exist', async () => {

            mockedSessionGetDatabase.mockReturnValue(mockMongoDatabase);
            mockListCollections.mockResolvedValue([]);

            await Collection.loadExistingCollections();

            expect(mockListCollections).toHaveBeenCalled();

            await Collection.createUpdateCollection(mockUserSchemaOpts);

            expect(mockedSessionGetDatabase).toHaveBeenCalledTimes(2);

            expect(mockCreateCollection).toHaveBeenCalledTimes(1);
            expect(mockCreateCollection).toHaveBeenNthCalledWith(1,
                mockUserSchemaOpts.collectionName,
                { validator: { $jsonSchema: mockUserSchemaOpts.schema } }
            );

            Collection.clearExistingCollections();
        });

        it('should call to create the collection if it does not exist', async () => {

            mockedSessionGetDatabase.mockReturnValue(mockMongoDatabase);
            mockListCollections.mockResolvedValue(mockListedCollections);

            await Collection.loadExistingCollections();

            expect(mockListCollections).toHaveBeenCalled();

            await Collection.createUpdateCollection(mockUserSchemaOpts);

            expect(mockedSessionGetDatabase).toHaveBeenCalledTimes(2);

            expect(mockCommand).toHaveBeenCalledTimes(1);
            expect(mockCommand).toHaveBeenNthCalledWith(1,
                {
                    collMod: mockUserSchemaOpts.collectionName,
                    validator: { $jsonSchema: mockUserSchemaOpts.schema }
                }
            );

            Collection.clearExistingCollections();
        });

    });

});
