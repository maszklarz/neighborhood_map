import React, { Component } from 'react';
import PropTypes from 'prop-types';

class QueryBox extends Component {
  onQueryChange = (query) => {
    this.props.updateQuery(query)
  }

  render() {
    return (
      <input
        id={this.props.id}
        tabIndex="0"
        className="query-input"
        name="places-filter"
        type="text"
        placeholder="Filter places by names or keywords"
        value={this.props.query}
        onChange={(event) => this.onQueryChange(event.target.value)}
      />
    )
  }
}

QueryBox.propTypes = {
  id: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  updateQuery: PropTypes.func.isRequired,
}

export default QueryBox
