import React from 'react';
import ReactDOM from 'react-dom';
import SolrConnector from '../src/react-solr-connector';
import SolrConnectorDemo from './demo.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: null
    }
  }

  doSearch(searchParams) {
    this.setState({searchParams});
  }

  render() {
    return <SolrConnector searchParams={this.state.searchParams}>
      <SolrConnectorDemo doSearch={this.doSearch.bind(this)}/>
    </SolrConnector>;
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
