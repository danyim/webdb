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

  constructor(props) {
    super(props)

    this.consoleEnd = null
  }

  componentDidUpdate(prevProps) {
    // Scroll to the bottom if the data prop has been updated
    if (prevProps.data.length !== this.props.data.length) {
      this.scrollToBottom(this.consoleEnd)
    }
  }

  scrollToBottom = node => {
    node.scrollIntoView({ behavior: 'smooth' })
  }

  render() {
    return (
      <pre className="Console">
        {this.props.data.map(v => v + '\r\n')}
        <span ref={r => (this.consoleEnd = r)} />
      </pre>
    )
  }
}

export default Console
