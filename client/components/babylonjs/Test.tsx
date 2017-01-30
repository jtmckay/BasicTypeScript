import * as React from 'react';
import * as BABYLON from 'babylonjs';

class Test extends React.Component<{}, {}> {
  refs: {
    [string: string]: any;
    renderCanvas:any;
  }
  engine;

  componentDidMount() {
    this.engine = new BABYLON.Engine(this.refs.renderCanvas, true);
  }

  render() {
    return (
      <div ref="renderCanvas" style={{width: "100%", height: "100%", touchAction: "none"}}>
      </div>
    );
  }
}

export default Test;
