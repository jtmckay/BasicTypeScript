import * as React from 'react';
import { Link } from 'react-router';

class OtherPage extends React.Component<{}, {}> {

  render() {
    return (
      <div className="col-xs-12" style={{textAlign: "center"}}>
        <div><Link to="/">Take me Home!</Link>.</div>
      </div>
    );
  }
}

export default OtherPage;
