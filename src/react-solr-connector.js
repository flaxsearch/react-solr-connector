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

  /*
   * When the component mounts, do an initial search.
   */
  componentDidMount() {
    if (this.props.searchParams) {
      this.doSearch(this.props.searchParams);
    }
  }

  /*
   * something has changed. Update the search results.
   */
  componentWillReceiveProps(newProps) {
    if (newProps.searchParams) {
      this.doSearch(newProps.searchParams);
    }
  }

  doSearch(searchParams) {
    if (searchParams.query) {
      this.setState({ busy: true, error: null, searchParams });
      let params = Object.assign({wt: "json"}, searchParams.highlightParams);
      let solrParams = {
        offset: searchParams.offset,
        limit: searchParams.limit,
        query: searchParams.query,
        filter: searchParams.filter,
        fields: searchParams.fetchFields,
        facet: searchParams.facet,
        params
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
        this.setState({ busy: false, error: null, response });
      })
      .catch((error) => {
        this.setState({ busy: false, error: "" + error, response: null });
      });
    } else {
      // no search to perform
      this.setState({ busy: false, error: null, response: null });
    }
  }

  render() {
    let solrConnector = {
      searchParams: this.state.searchParams,
      busy: this.state.busy,
      error: this.state.error,
      response: this.state.response,
    };

    const clones = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {solrConnector})
    );

    return <div>{clones}</div>;
  }
}

SolrConnector.propTypes = {
  searchParams: React.PropTypes.object
};

export default SolrConnector;
