import React from 'react';

class SolrConnector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      busy: true,
      response: null
    };
  }

  render() {
    console.log("FIXME SolrConnector.render");

    // this is the object we will inject into the children
    let solrConnector = {
      conf: this.props.conf,
      searchParams: this.props.searchParams
    };

    const clones = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {solrConnector})
    );

    return <div>{clones}</div>;
  }
}

export default SolrConnector;
