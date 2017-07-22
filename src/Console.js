import { h, Component } from 'preact'
import './Console.css'

class Console extends Component {
  render() {
    return (
      <pre className="Console">
        {this.props.data}
      </pre>
    )
  }
}

export default Console
