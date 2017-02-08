import * as React from 'react';
import { Link } from 'react-router';
import Canvas from '../babylonjs/Canvas';
import Label from './Label';

interface Props {
  showSettings: boolean;
  changeSetting: (settingName: string, settingValue: any) => void;
  settings?: {
    movementSpeed: number;
    mouseSensitivity: number;
    stickyRightMouseClick: boolean;
  };
}

class Settings extends React.Component<Props, {}> {
  render() {
    if (this.props.showSettings) {
      return (
        <div style={{ height: "100%", width: 400, position: "absolute", right: 0, backgroundColor: "grey", opacity: .9 }}>
          <div>
            <h1 style={{textAlign: "center"}}>Settings</h1>
            <Label
              label={<span>Mouse Sensitivity</span>}
              control={<input type="text"
                value={this.props.settings.mouseSensitivity}
                onChange={event => this.props.changeSetting("mouseSensitivity", (event.target as HTMLInputElement).value)} />}
            />
            <Label
              label={<span>Sticky Right Mouse Click</span>}
              control={<input type="checkbox"
                checked={this.props.settings.stickyRightMouseClick}
                onChange={event => this.props.changeSetting("stickyRightMouseClick", !this.props.settings.stickyRightMouseClick)} />}
            />
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

export default Settings;
