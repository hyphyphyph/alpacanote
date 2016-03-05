import React from 'react';
import ReactDom from 'react-dom';

class FileList extends React.Component {
  render () {
    return (
      <ul>
        <li>Hello</li>
        <li>World</li>
      </ul>
    );
  }
}

ReactDom.render(<FileList />, document.getElementById('app'));
