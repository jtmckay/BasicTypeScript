import * as React from 'react';

class LayoutPage extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <div>
          <h1 style={{textAlign: "center", width: "100%", position: "absolute", zIndex: -1000}}>WebGL is not supported</h1>
        </div>
        <div>
          {this.props.children}
        </div>
        <div>
        </div>
      </div>
    );
  }
}

export default LayoutPage;
