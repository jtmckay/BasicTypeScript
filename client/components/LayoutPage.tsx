import * as React from 'react';

class LayoutPage extends React.Component<{}, {}> {
  render() {
    return (
      <div className="container-fluid">
        <div className="header row">
        </div>
        <div className="body row">
          {this.props.children}
        </div>
        <div className="footer row">
        </div>
      </div>
    );
  }
}

export default LayoutPage;
