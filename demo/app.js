import React from 'react';
import ReactDOM from 'react-dom';
import SolrConnector from '../src/react-solr-connector';
import SolrConnectorDemo from './demo.js';

const App = (props) =>
  <SolrConnector>
    <SolrConnectorDemo/>
  </SolrConnector>;

ReactDOM.render(<App/>, document.getElementById('app'));
