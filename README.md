# elastic-search-lib
Module written in nodejs to integrate easily with Elastic Search. It has additional integrations to support linting, testing,
coverage, reporting, GitGub actions for publishing to npm repository, dependency updates and other goodies.

Easily use this module to interact with the ElasticSearch Engine.

# What is ElasticSearch?
Elasticsearch is a distributed, free and open search and analytics engine for all types of data, including textual, numerical, geospatial, structured, and unstructured. Elasticsearch is built on Apache Lucene and was first released in 2010 by Elasticsearch N.V. (now known as Elastic). Known for its simple REST APIs, distributed nature, speed, and scalability, Elasticsearch is the central component of the Elastic Stack, a set of free and open tools for data ingestion, enrichment, storage, analysis, and visualization. Commonly referred to as the ELK Stack (after Elasticsearch, Logstash, and Kibana), the Elastic Stack now includes a rich collection of lightweight shipping agents known as Beats for sending data to Elasticsearch.

For more details, please refer: https://www.elastic.co/what-is/elasticsearch 

## Code Guardian
[![<app> build verification](https://github.com/aicore/template-nodejs/actions/workflows/build_verify.yml/badge.svg)](https://github.com/aicore/template-nodejs/actions/workflows/build_verify.yml)

<a href="https://sonarcloud.io/summary/new_code?id=aicore_elasticsearch-lib">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_elasticsearch-lib&metric=alert_status" alt="Sonar code quality check" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_elasticsearch-lib&metric=security_rating" alt="Security rating" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_elasticsearch-lib&metric=vulnerabilities" alt="vulnerabilities" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_elasticsearch-lib&metric=coverage" alt="Code Coverage" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_elasticsearch-lib&metric=bugs" alt="Code Bugs" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_elasticsearch-lib&metric=reliability_rating" alt="Reliability Rating" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_elasticsearch-lib&metric=sqale_rating" alt="Maintainability Rating" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_elasticsearch-lib&metric=ncloc" alt="Lines of Code" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_elasticsearch-lib&metric=sqale_index" alt="Technical debt" />
</a>


# Usage Instrcution

## Installing

Install it directly using npm by running the command below:

``
npm i @aicore/template-nodejs
``

## Prerequisites
Inorder to use this module, elasticsearch should be installed on the server/local machine. Please refer to the links below:

1. https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html
2. https://www.linode.com/docs/guides/databases/elasticsearch/

### **List of Available Operations:**
* createIndices
* bulkInsert
* bulkUpdate
* bulkDelete
* search
* get


## Code Usage

### **1. createIndices**

Create Index API is used to manually create an index in Elasticsearch. All documents in Elasticsearch are stored inside of one index or another. Please refer API docs for more details.
* https://www.elastic.co/guide/en/elasticsearch/reference/6.8/indices-create-index.html 

#### **Required Parameters**

 - **nodeAddress (Type: String)**: Complete URL endpoint of the node including port. For e.g http://165.34.23.1:9200/
 - **mappingObject (Type: JSON Object)**: omposite object according to elastic search standards.
#### **Example**
 ```js
 // import the module directly after installation
 import searchClient from '@aicore/elasticsearch-lib';

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
 
 ```
### **2. bulkInsert/bulkUpdate/bulkDelete**

Performs multiple indexing or delete operations in a single API call. This reduces overhead and can greatly increase indexing speed. Please refer API docs for more details.
 * https://www.elastic.co/guide/en/elasticsearch/reference/6.8/docs-bulk.html?spm=a2c4g.11186623.0.0.636e25b7I4qrj1

  
   #### **Required Parameters**

- **nodeAddress (Type: String)**: Complete URL endpoint of the node including port. For e.g http://165.34.23.1:9200/
- **indexName (Type: String)**: Unique identifier for index.
- **datasets (Type: Array)**: Array of data objects for bulk insert.

 **Please Note: The bulkInsert, bulkUpdate and bulkDelete modules all use the same underlying elasticSearch bulk API so the usage is similar to each other.**
#### **Example**

 ```js
 //import the module
 import searchClient from '@aicore/elasticsearch-lib'
//array of data objects to be inserted
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
 ```

### **3. search**
The search API allows you to execute a search query and get back search hits that match the query.Please refer API docs for more details.
 * https://www.elastic.co/guide/en/elasticsearch/reference/6.8/search-search.html

#### **Required Parameters**

- **nodeAddress (Type: String)**: Complete URL endpoint of the node including port. For e.g http://165.34.23.1:9200/
- **indexName (Type: String)**: Unique identifier for index.
- **searchQuery (Type: JSON Object)**: containing search parameters. Refer API docs for format
#### **Example**
```js
////import the module
import searchClient from '@aicore/elasticsearch-lib';
//composite searchQuery object to retrieve all results
const searchQuery = {
        index: indexName,
        body: {
            query: {
                match_all: {}
            }
        }
    };

const searchResponse = await searchClient.search(nodeAddress, indexName, searchQuery);
```
### **4. get**

The get API allows to get a typed JSON document from the index based on its id. Please refer API docs for more details.
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-get.html

#### **Required Parameters**
 - **nodeAddress (Type: String)**: Complete URL endpoint of the node including port. For e.g http://165.34.23.1:9200/
- **indexName (Type: String)**: Unique identifier for index.
- **getQuery (Type: JSON Object)**: Composite object containing get parameters. Refer API docs for format

#### **Example**
```js
////import the module
import searchClient from '@aicore/elasticsearch-lib';

const getQuery = {
    index: 'game-of-thrones',
    id: '1'
};

const getResponse = await searchClient.get(nodeAddress, indexName, getQuery);

console.log(getResponse);

```


# Commands available

## Building
Since this is a pure JS template project, build command just runs test with coverage.
```shell
> npm install   // do this only once.
> npm run build
```

## Linting
To lint the files in the project, run the following command:
```shell
> npm run lint
```
To Automatically fix lint errors:
```shell
> npm run lint:fix
```

## Testing
To run all tests:
```shell
> npm run test
  Hello world Tests
    ✔ should return Hello World
    #indexOf()
      ✔ should return -1 when the value is not present
```

Additionally, to run unit/integration tests only, use the commands:
```shell
> npm run test:unit
> npm run test:integ
```

## Coverage Reports
To run all tests with coverage:

```shell
> npm run cover
  Hello world Tests
    ✔ should return Hello World
    #indexOf()
      ✔ should return -1 when the value is not present


  2 passing (6ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |                   
 index.js |     100 |      100 |     100 |     100 |                   
----------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 100% ( 5/5 )
Branches     : 100% ( 2/2 )
Functions    : 100% ( 1/1 )
Lines        : 100% ( 5/5 )
================================================================================
Detailed unit test coverage report: file:///template-nodejs/coverage-unit/index.html
Detailed integration test coverage report: file:///template-nodejs/coverage-integration/index.html
```
After running coverage, detailed reports can be found in the coverage folder listed in the output of coverage command.
Open the file in browser to view detailed reports.

To run unit/integration tests only with coverage
```shell
> npm run cover:unit
> npm run cover:integ
```

Sample coverage report:
![image](https://user-images.githubusercontent.com/5336369/148687351-6d6c12a2-a232-433d-ab62-2cf5d39c96bd.png)

### Unit and Integration coverage configs
Unit and integration test coverage settings can be updated by configs `.nycrc.unit.json` and `.nycrc.integration.json`.

See https://github.com/istanbuljs/nyc for config options.

# Publishing packages to NPM
To publish a package to npm, push contents to `npm` branch in 
this repository. 

## Publishing `@aicore/package*`
If you are looking to publish to package owned by core.ai, you will need access to the GitHub Organization secret `NPM_TOKEN`.

For repos managed by [aicore](https://github.com/aicore) org in GitHub, Please contact your Admin to get access to core.ai's NPM tokens.


## Publishing to your own npm account
Alternatively, if you want to publish the package to your own npm account, please follow these docs:
1. Create an automation access token by following this [link](https://docs.npmjs.com/creating-and-viewing-access-tokens).
2. Add NPM_TOKEN to your repository secret by following this [link](https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow)

To edit the publishing workflow, please see file: `.github/workflows/npm-publish.yml`


# Dependency updates
  We use Rennovate for dependency updates: https://blog.logrocket.com/renovate-dependency-updates-on-steroids/
  * By default, dep updates happen on sunday every week.
  * The status of dependency updates can be viewed here if you have this repo permissions in github: https://app.renovatebot.com/dashboard#github/aicore/template-nodejs
  * To edit rennovate options, edit the rennovate.json file in root, see https://docs.renovatebot.com/configuration-options/
  Refer 
  
# Code Guardian
Several automated workflows that check code integrity are integrated into this template.
These include:
1. GitHub actions that runs build/test/coverage flows when a contributor raises a pull request
2. [Sonar cloud](https://sonarcloud.io/) integration using `.sonarcloud.properties`
   1. In sonar cloud, enable Automatic analysis from `Administration
      Analysis Method` for the first time ![image](https://user-images.githubusercontent.com/5336369/148695840-65585d04-5e59-450b-8794-54ca3c62b9fe.png)

## IDE setup
SonarLint is currently available as a free plugin for jetbrains, eclipse, vscode and visual studio IDEs.
Use sonarLint plugin for webstorm or any of the available
IDEs from this link before raising a pull request: https://www.sonarlint.org/ .

SonarLint static code analysis checker is not yet available as a Brackets
extension.

## Internals
### Testing framework: Mocha , assertion style: chai
 See https://mochajs.org/#getting-started on how to write tests
 Use chai for BDD style assertions (expect, should etc..). See move here: https://www.chaijs.com/guide/styles/#expect

### Mocks and spies: sinon
 if you want to mock/spy on fn() for unit tests, use sinon. refer docs: https://sinonjs.org/

### Note on coverage suite used here:
we use c8 for coverage https://github.com/bcoe/c8. Its reporting is based on nyc, so detailed docs can be found
 here: https://github.com/istanbuljs/nyc ; We didn't use nyc as it do not yet have ES module support
 see: https://github.com/digitalbazaar/bedrock-test/issues/16 . c8 is drop replacement for nyc coverage reporting tool
