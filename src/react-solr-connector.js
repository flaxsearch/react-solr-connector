import React from 'react';

class SolrConnector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: null,
      busy: false,
      error: null,
      response: null
    };
  }

  // run a search asynchronously. Child components are passed this as a callback
  doSearch(searchParams) {
    this.setState({ busy: true, error: null, searchParams });

    let solrParams = {
      offset: searchParams.offset,
      limit: searchParams.limit,
      query: searchParams.query,
      filter: searchParams.filters,
      fields: searchParams.fetchFields,
      params: {
        wt: "json"
      }
    };

    const reqBody = JSON.stringify(solrParams);

    // do the search. 'post' is required with a fetch() body. Solr doesn't mind
    fetch(searchParams.solrSearchUrl, {
      method: 'post',
      body: reqBody,
      headers: new Headers({
      		'Content-Type': 'application/json'
        })
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw response.status + " " + response.statusText;
      }
    })
    .then((response) => {
      this.setState({ busy: false, error: null,
        response: this.makeSearchResponse(response, searchParams)
      });
    })
    .catch((error) => {
      this.setState({ busy: false, error: "" + error });
    });
  }

  makeSearchResponse(resp, searchParams) {
    return resp;    // FIXME
  }

  render() {
    let solrConnector = {
      searchParams: this.state.searchParams,
      busy: this.state.busy,
      error: this.state.error,
      response: this.state.response,
      doSearch: this.doSearch.bind(this)
    };

    const clones = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {solrConnector})
    );

    return <div>{clones}</div>;
  }
}

export default SolrConnector;
