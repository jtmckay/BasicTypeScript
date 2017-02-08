import * as React from 'react';

interface Props {
  label: any;
  control: any;
}

class Settings extends React.Component<Props, {}> {
  render() {
    return (
      <div style={{ position: "relative", padding: 10 }}>
        <div style={{ width: "50%", float: "left" }}>
          {this.props.label}
        </div>
        <div style={{ width: "50%", float: "left" }}>
          {this.props.control}
        </div>
      </div>
    );
  }
}

export default Settings;
