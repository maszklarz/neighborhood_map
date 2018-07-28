import React, { Component } from 'react';

class QueryBox extends Component {
  onQueryChange = (query) => {
    this.props.updateQuery(query)
  }

  render() {
    return (
      <input
        id="places-filter"
        tabIndex="0"
        className="query-input"
        name="places-filter"
        type="text"
        placeholder="Filter places"
        value={this.props.query}
        onChange={(event) => this.onQueryChange(event.target.value)}
      />
    )
  }
}

export default QueryBox
