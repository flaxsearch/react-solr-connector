import React from 'react';

class SolrConnectorDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      solrSearchUrl: "http://localhost:8983/solr/techproducts/select",
      query: "memory",
    }
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.solrConnector.doSearch({
      solrSearchUrl: this.state.solrSearchUrl,
      query: this.state.query
    });
  }

  render() {
    return <div>
      <form className="inputForm" onSubmit={this.onSubmit.bind(this)}>
        <h4>searchParams:</h4>
        <p>
          solrSearchUrl: {" "}
          <input type="text" value={this.state.solrSearchUrl}
            onChange={e => {this.setState({ solrSearchUrl: e.target.value })}} />
        </p>
        <p>
          query: {" "}
          <input type="text" value={this.state.query}
            onChange={e => {this.setState({ query: e.target.value })}} />
        </p>
        <p>
          <button type="submit">Search</button>
        </p>
      </form>
      <div className="jsonOutput">
        <pre>
          this.props.solrConnector: {"\n\n"}
          { JSON.stringify(this.props.solrConnector, null, 2) }
        </pre>
      </div>
    </div>;
  }
}

export default SolrConnectorDemo;
