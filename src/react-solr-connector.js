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
    this.setState({ busy: true, searchParams });
    setTimeout(() => {
      this.setState({
        busy: false,
        response: "FIXME " + new Date().getTime()
      });
    }, 2000);
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
