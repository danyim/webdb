import { h, Component } from 'preact'

class TableRow extends Component {
  render() {
    return (
      <div className="table-row">
        <div className="table-column">
          {this.props.key}
        </div>
        <div className="table-column">
          {this.props.value}
        </div>
      </div>
    )
  }
}

export default TableRow
