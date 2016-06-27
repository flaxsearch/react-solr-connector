import React from 'react';

class SolrConnectorDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      solrSearchUrl: "http://localhost:8983/solr/techproducts/select",
      query: "memory",
      filter: "",
      fetchFields: ""
    }
  }

  onSubmit(event) {
    event.preventDefault();
    let searchParams = {
      facet: {
        manufacturer: {
          type: "terms",
          field: "manu_id_s",
          limit: 20
        },
        price_range_0_100: {
          query: "price:[0 TO 100]"
        }
      },
      solrSearchUrl: this.state.solrSearchUrl,
      query: this.state.query,
      limit: 10,
      highlightParams: {
        "hl": "true",
        "hl.fl": "name manu",
        "hl.snippets": 1,
        "hl.fragsize": 500
      },
      idField: "id",
      filter: [this.state.filter],
      fetchFields: this.state.fetchFields.split(" ")
    };
    this.props.solrConnector.doSearch(searchParams);
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
          {" "}
          filter: {" "}
          <input type="text" value={this.state.filter}
            onChange={e => {this.setState({ filter: e.target.value })}} />
        </p>
        <p>
          fetchFields: {" "}
          <input type="text" value={this.state.fetchFields}
            onChange={e => {this.setState({ fetchFields: e.target.value })}} />
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
