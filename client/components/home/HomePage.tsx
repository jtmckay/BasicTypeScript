import * as React from 'react';
import { Link } from 'react-router';
import Test from '../babylonjs/Test';

class HomePage extends React.Component<{}, {}> {

  render() {
    return (
      <div>
          <Test />
      </div>
    );
  }
}

export default HomePage;
