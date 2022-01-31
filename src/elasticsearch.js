require('array.prototype.flatmap').shim();
const { Client } = require('@elastic/elasticsearch');
let client = null;

/**
 * private function that initializes the elastic search client.
 * @param nodeAddress Complete URL endpoint of the node including port. For e.g http://165.34.23.1:9200/
 * @returns {Client} initialized client
 */
function setUpClient(nodeAddress) {
    if (client == null) {
        client = new Client({
            node: nodeAddress
        });
    }
    return client;
}

/**
 * Create Index API is used to manually create an index in Elasticsearch.
 * All documents in Elasticsearch are stored inside of one index or another.
 * Please refer API doc https://www.elastic.co/guide/en/elasticsearch/reference/6.8/indices-create-index.html
 * @param nodeAddress Complete URL endpoint of the node including port. For e.g http://165.34.23.1:9200/
 * @param mappingObject composite object according to elastic search standards.
 * @returns {Promise<ApiResponse<IndicesCreateResponse, unknown>>} API response
 */
async function createIndices(nodeAddress, mappingObject) {
    if (!nodeAddress || !mappingObject) {
        throw "Invalid value for parameter : nodeAddress and mappingObject are required parameters.";
    }

    client = setUpClient(nodeAddress);
    const result = await client.indices.create(mappingObject);
    return result;
}

/**
 * Performs multiple indexing or delete operations in a single API call.
 * This reduces overhead and can greatly increase indexing speed.
 * Please refer API docs for more details.
 * https://www.elastic.co/guide/en/elasticsearch/reference/6.8/docs-bulk.html?spm=a2c4g.11186623.0.0.636e25b7I4qrj1
 * @param nodeAddress Complete URL endpoint of the node including port. For e.g http://165.34.23.1:9200/
 * @param indexName Unique identifier for index.
 * @param datasets Array of data objects for bulk insert.
 * @param options Extra options to be passed as parameters.
 * @returns {Promise<void>} API response
 */
async function bulkInsert(nodeAddress, indexName, datasets, options = null) {
    if (!nodeAddress || !indexName || !datasets) {
        throw "Invalid value for parameter : nodeAddress,mappingObject, and datasets are required parameters.";
    }
    client = setUpClient(nodeAddress);
    const body = datasets.flatMap(doc =>
        [{ index: { _index: indexName, _type: '_doc' }}, doc]);
    const response = await performBulkOperation(client, indexName, body);
    return response;
}

/**
 * Performs multiple indexing or delete operations in a single API call.
 * This reduces overhead and can greatly increase indexing speed.
 * Please refer API docs for more details.
 * https://www.elastic.co/guide/en/elasticsearch/reference/6.8/docs-bulk.html?spm=a2c4g.11186623.0.0.636e25b7I4qrj1
 * @param nodeAddress Complete URL endpoint of the node including port. For e.g http://165.34.23.1:9200/
 * @param indexName  Unique identifier for index.
 * @param datasets Array of data objects for bulk update.
 * @param options Extra options to be passed as parameters.
 * @returns {Promise<void>} API Response
 */
async function bulkUpdate(nodeAddress, indexName, datasets, options = null) {

    if (!nodeAddress || !indexName || !datasets) {
        throw "Invalid value for parameter : nodeAddress,mappingObject, and datasets are required parameters.";
    }

    client = setUpClient(nodeAddress);
    const body = datasets.flatMap(doc =>
        [{ update: { _index: indexName, _type: '_doc' }}, doc]);
    const response = await performBulkOperation(client, indexName, body);
    return response;
}
/**
 * Performs multiple indexing or delete operations in a single API call.
 * This reduces overhead and can greatly increase indexing speed.
 * Please refer API docs for more details.
 * https://www.elastic.co/guide/en/elasticsearch/reference/6.8/docs-bulk.html?spm=a2c4g.11186623.0.0.636e25b7I4qrj1
 * @param nodeAddress Complete URL endpoint of the node including port. For e.g http://165.34.23.1:9200/
 * @param indexName  Unique identifier for index.
 * @param datasets Array of data objects for bulk delete.
 * @param options Extra options to be passed as parameters.
 * @returns {Promise<void>} API Response
 */
async function bulkDelete(nodeAddress, indexName, datasets, options = null) {

    if (!nodeAddress || !indexName || !datasets) {
        throw "Invalid value for parameter : nodeAddress,mappingObject, and datasets are required parameters.";
    }

    client = setUpClient(nodeAddress);
    const body = datasets.flatMap(doc =>
        [{ delete: { _index: indexName  }}, doc]);
    const response = await performBulkOperation(client, indexName, body);
    return response;
}

/**
 * The search API allows you to execute a search query and get back search hits that match the query.
 * Please refer API docs for more details.
 * https://www.elastic.co/guide/en/elasticsearch/reference/6.8/search-search.html
 * @param nodeAddress Complete URL endpoint of the node including port. For e.g http://165.34.23.1:9200/
 * @param indexName Unique identifier for index.
 * @param searchQuery  Composite object containing search parameters. Refer API docs for format
 * @returns {Promise<SearchHit<T>[] | SearchHit<Record<string, any>>[]>} API Response
 */
async function search(nodeAddress, indexName, searchQuery) {

    if (!nodeAddress || !indexName || !searchQuery) {
        throw "Invalid value for parameter : nodeAddress,mappingObject, and searchQuery are required parameters.";
    }

    client = setUpClient(nodeAddress);
    const { body } = await client.search(searchQuery);
    if (!body || body.error) {
        const errorMsg = "Search query failed with the following error : " + JSON.stringify(body.error);
        console.log(errorMsg);
        throw errorMsg;
    }
    if (body.hits && body.hits.hits) {
        console.log("Search Results Retrieve successfully" + JSON.stringify(body.hits.hits));
        return body.hits.hits;
    }
}

/**
 * The get API allows to get a typed JSON document from the index based on its id.
 * Please refer API docs for more details.
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-get.html
 * @param nodeAddress Complete URL endpoint of the node including port. For e.g http://165.34.23.1:9200/
 * @param indexName Unique identifier for index.
 * @param getQuery Composite object containing get parameters. Refer API docs for format
 * @returns {Promise<*>}
 */
async function getRecord(nodeAddress, indexName, getQuery) {

    if (!nodeAddress || !indexName || !getQuery) {
        throw "Invalid value for parameter : nodeAddress,mappingObject, and getQuery are required parameters.";
    }

    const { body } = await client.get(getQuery);
    if (!body || body.error) {
        const errorMsg = "Get query failed with the following error : " + body.error;
        console.log(errorMsg);
        throw errorMsg;
    }

    console.log("Results Retrieve successfully" + JSON.stringify(body));
    return body;
}

/**
 * Private function for isolating the documents failed to update,index or delete.
 * @param client elastic search client
 * @param indexName Unique identifier for index.
 * @param body Request body(composite object) for bulk operation.
 * @returns {Promise<void>} Response along with error documents.
 */
async function performBulkOperation(client, indexName, body) {
    // here we are forcing an index refresh,
    // otherwise we will not get any result
    // in the consequent search
    const {body: bulkResponse} = await client.bulk({refresh: true, body});
    if (bulkResponse.errors) {
        const erroredDocuments = [];
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0];
            if (action[operation].error) {
                erroredDocuments.push({
                    // If the status is 429 it means that you can retry the document,
                    // otherwise it's very likely a mapping error, and you should
                    // fix the document before to try it again.
                    status: action[operation].status,
                    error: action[operation].error,
                    operation: body[i * 2],
                    document: body[i * 2 + 1]
                });
            }
        });
        console.log("Error occured on the following records for bulk insert: " + JSON.stringify(erroredDocuments));
    }
    const { body: count } = await client.count({ index: indexName });
    console.log("Number of records inserted successfully" + JSON.stringify(count));
}

module.exports = {
    createIndices,
    bulkInsert,
    bulkUpdate,
    bulkDelete,
    search,
    getRecord
};
