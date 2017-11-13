import * as React from 'react'

export default class AppComponent extends React.Component<any> {
    render() {
        return <div>
            <div>{this.props.app.count}</div>
            <button onClick={this.props.addCount.bind(this)}>ADD</button>
        </div>
    }
}
