import * as React from 'react';
import { Link } from 'react-router';

class HomePage extends React.Component<{}, {}> {

  render() {
    return (
      <div>
        <div className="h1">Welcome to the Basic TypeScript App</div>
          <div style={{margin: 20}}>
            <div>Yay</div>
            <br />
            <div>Here's a link to the <Link to="other">Other Page</Link>.</div>
          </div>
      </div>
    );
  }
}

export default HomePage;
