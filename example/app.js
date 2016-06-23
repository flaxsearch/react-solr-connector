import React from 'react';
import ReactDOM from 'react-dom';
import SolrConnector from '../src/react-solr-connector';

const JsonProps = (props) =>
  <pre>
    { JSON.stringify(props, null, 2) }
  </pre>;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      searchParams: {}
    };
  }

  onChange(event) {
    this.setState({ query: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({ searchParams: {
      query: this.state.query
    }});
  }

  render() {
    return <div>
      <form onSubmit={this.onSubmit.bind(this)}>
        Search: <input type="text"
          value={this.state.query}
          onChange={this.onChange.bind(this)} />
      </form>
      <SolrConnector conf={"FIXME"} searchParams={this.state}>
        <JsonProps/>
      </SolrConnector>
    </div>;
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
