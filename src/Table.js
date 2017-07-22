import { h, Component } from 'preact'
import PropTypes from 'prop-types'
import TableRow from './TableRow'
import './Table.css'

class Table extends Component {
  static propTypes = {
    rows: PropTypes.array.isRequired
  }

  static defaultProps = {
    rows: []
  }

  render() {
    return (
      <div className="table">
        <div className="table-header" />
        {this.props.rows.map(r => <TableRow {...r} />)}
        {this.props.rows.length === 0 &&
          <div className="no-rows">No rows found</div>}
        <div className="table-footer" />
      </div>
    )
  }
}

export default Table
