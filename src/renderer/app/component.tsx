import * as React from 'react'
import {AppProps} from './index'

export default class AppComponent extends React.Component<AppProps> {
  render() {
    return <div>
      <div>{this.props.app.count}</div>
      <button onClick={() => this.props.addCount(1)}>ADD</button>
    </div>
  }
}
