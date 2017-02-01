import * as React from 'react';
import { Link } from 'react-router';
import Canvas from '../babylonjs/Canvas';

class HomePage extends React.Component<{}, {}> {

  render() {
    return (
      <div>
          <Canvas />
      </div>
    );
  }
}

export default HomePage;
