/* eslint-disable */

import React from 'react';
import { connect } from 'react-redux';
import { Map as makeMap } from 'immutable';

import MatchedText from '../matched-text';
import ShowMore from '../show-more';
import { formatDataType } from '../../utils/string-utils';
import { getSerializedTimeTravelTimestamp } from '../../utils/web-api-utils';

class NodeDetailsInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      expanded: false,
    };
    this.handleClickMore = this.handleClickMore.bind(this);
  }

  handleClickMore() {
    const expanded = !this.state.expanded;
    this.setState({ expanded });
  }

  render() {
    const { timestamp, matches = makeMap() } = this.props;
    let rows = this.props.rows || [];
    let notShown = 0;

    rows = rows.filter(row => {
      return (
        row.id !== 'openPorts' &&
        row.id !== 'probeId' &&
        row.id !== 'authToken' &&
        row.id !== 'upgrade_message' &&
        row.id !== 'upgrade_status' &&
        row.id !== 'connectedProcesses' &&
        row.id !== 'captureStatus'
      );
    });

    const prime = rows;

    if (!this.state.expanded && prime.length < rows.length) {
      // check if there is a search match in non-prime fields
      const hasNonPrimeMatch =
        matches &&
        rows.filter(row => row.priority >= 0 && matches.has(row.id)).length > 0;
      if (!hasNonPrimeMatch) {
        notShown = rows.length - prime.length;
        rows = prime;
      }
    }

    if (rows.length === 0) {
      return null;
    }

    return (
      <div className="node-details-content-section">
        <div className="node-details-content-section-header">Metadata</div>
        <div className="node-details-info">
          {/* {chartComp} */}
          {rows.map(field => {
            const { value, title } = formatDataType(field, timestamp);
            return (
              <div className="node-details-info-field" key={field.id}>
                <div
                  className="node-details-info-field-label truncate"
                  title={field.label}
                >
                  {field.label}
                </div>
                <div
                  className="node-details-info-field-value truncate"
                  title={title}
                >
                  <MatchedText
                    text={value}
                    truncate={field.truncate}
                    match={matches.get(field.id)}
                  />
                </div>
              </div>
            );
          })}
          <ShowMore
            handleClick={this.handleClickMore}
            collection={this.props.rows}
            expanded={this.state.expanded}
            notShown={notShown}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    timestamp: getSerializedTimeTravelTimestamp(state),
  };
}

export default connect(mapStateToProps)(NodeDetailsInfo);
