import { h, Component } from 'preact'
import PropTypes from 'prop-types'
import './Console.css'

class Console extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  static defaultProps = {
    data: []
  }

  render() {
    return (
      <pre className="Console">
        {
          // this.props.data
        }
        {this.props.data.map(v => v + '\r\n')}
      </pre>
    )
  }
}

export default Console
