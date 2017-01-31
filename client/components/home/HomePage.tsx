import * as React from 'react';
import { Link } from 'react-router';
import Scene from '../babylonjs/Scene';

class HomePage extends React.Component<{}, {}> {

  render() {
    return (
      <div>
          <Scene />
      </div>
    );
  }
}

export default HomePage;
