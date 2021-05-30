import React, { Component } from 'react'
import './index.less'
export default class LinkButton extends Component {
    render() {
        return (
           <button className="link-button" {...this.props}></button>
        )
    }
}

// import React from 'react'
// import './index.less'
// export default function LinkButton(props) {
//     return (
//         <button {...props} className="link-button"></button>
//     )
// }

