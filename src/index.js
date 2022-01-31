/**
 * Driver file for the module, uncomment this file to test the methods
const searchClient = require('./elasticsearch.js');
const nodeAddress = 'INSERT_YOUR_HOST_ADDRESS';
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
            name: 'jrowny.brackets.snippets',
            title: 'Brackets Snippets',
            description: 'Provides ability to use code snippets in Brackets.'
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
