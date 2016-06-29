# react-solr-connector
A React component which provides access to a
[Solr](http://lucene.apache.org/solr/)
server. Suitable for use in simple React apps which do not make use of a state management framework like
[Redux](https://github.com/reactjs/redux).
Since the component uses the Solr JSON API, only versions from 5 onward are supported (and I have only tested with 6.0.0).

## Installation

Install the module with npm:
```
npm install --save react-solr-connector
```

## Using the component

The module exports one default object, `SolrConnector`. This should be used to wrap your application components:
```
import SolrConnector from 'react-solr-connector';
...
<SolrConnector>
  <MyApp/>
</SolrConnector>
```

`SolrConnector` injects a `solrConnector` prop into all of its immediate children. This is an object with the structure:
```
{
  doSearch,
  searchParams,
  busy,
  response,
  error
}
```

`doSearch` is a function which should be called from the app to trigger a Solr search, for example when a Search button is clicked. The calling code should pass an object containing search parameters (see below). `searchParams` is a copy of the object passed to `doSearch`. The search is performed asynchronously and `busy` is set to true in the interval between `doSearch` being called and the response (or error) being available (`busy` could be used to indicate to the user that a search is in progress, for example by displaying a spinner). `response` is null until a response from Solr is received, at which point it is set to the value of the response object from Solr (including the `responseHeader`, the main `response` object, and any `facets`, `highlighting` objects, etc.) `busy` is also set to `false`. If an error occurs, the `error` property is set (to a descriptive string) instead of the `response` property.

The object passed to `doSearch` must have the following properties as a minimum:
```
{
  solrSearchUrl,
  query
}
```

Where `query` is the user-entered query string and `solrSearchUrl` is a Solr search endpoint, e.g.:
```
http://localhost:8983/solr/techproducts/select
```

If you are serving the app from a different host then you will have to
[enable CORS](http://marianoguerra.org/posts/enable-cors-in-apache-solr.html)
on Solr, or use a proxy service.

Optional properties for `doSearch` are:
```
{
  offset,
  limit,
  filter,
  fetchFields,
  facet,
  highlightParams
}
```

Most of these correspond exactly with properties in the
[Solr JSON API](http://yonik.com/solr-json-request-api/).
The exceptions are `fetchFields`, which corresponds to the Solr `fields` (which is not a very clear name in my opinion) and `highlightParams`. In fact, highlightParams can contain any of the "traditional" Solr params that the JSON API does not currently support, but highlighting is the most obvious application.

## Running tests
If you have cloned the `react-solr-connector`
[GitHub repository](https://github.com/flaxsearch/react-solr-connector),
you can run the `jest` tests with the following commands:
```
$ npm install
$ npm tests
```

## Running the demo
To run the simple demo, install Solr 6 and start it with the `techproducts` example:
```
$ bin/solr start -e techproducts
```

then start the Webpack demo server:
```
$ npm start
```

and point your browser at `http://localhost:8080/demo/index.html`.
