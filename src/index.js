/**
 * Driver file for the module, uncomment this file to test the methods
import searchClient from './elasticsearch.js';
const nodeAddress = 'http://172.105.38.208:9200/';
const indexName = 'extension_registry_beta';

async function run() {
    const indices = {
        index: indexName,
        body: {
            mappings: {
                extension_registry_beta: {
                    properties: {
                        name: { type: 'text' },
                        title: { type: 'text' },
                        description: { type: 'text'}
                    }
                }
            }
        }
    };

    const indexResponse = await searchClient.createIndices(nodeAddress, indices);
    console.log("Create Index response received :" + JSON.stringify(indexResponse));
    //Sample log: https://pastebin.com/1e1axYQE

    const dataset = [
        {
            name: 'Theme101',
            title: 'Brackets',
            description: 'Provides ability to use code snippets in Brackets.',
            homepage: 'https://github.com/jrowny/brackets-snippets',
            author: {
                name: 'demo',
                email: 'test@gmail.com'
            }
        }];
     const bulkInsertResponse = await searchClient.bulkInsert(nodeAddress, indexName, dataset);
     console.log("Bulk Insert Response " + JSON.stringify(bulkInsertResponse));

    const searchQuery = {
        index: indexName,
        body: {
            query: {
                match_all: {}
            }
        }
    };

    const searchResponse = await searchClient.search(nodeAddress, indexName, searchQuery);
}

run().catch(console.log);
**/
