import { h, Component } from 'preact'
import PropTypes from 'prop-types'

class TableRow extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }

  render() {
    return (
      <div className="table-row">
        <div className="table-column">
          {this.props.keyName}
        </div>
        <div className="table-column">
          {this.props.value}
        </div>
      </div>
    )
  }
}

export default TableRow
