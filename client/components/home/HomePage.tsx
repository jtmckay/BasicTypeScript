import * as React from 'react';
import { Link } from 'react-router';
import Canvas from '../babylonjs/Canvas';
import Settings from './Settings';

interface State {
  showSettings?: boolean;
  settings?: {
    movementSpeed: number;
    mouseSensitivity: number;
    stickyRightMouseClick: boolean;
  };
}

class HomePage extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state ={
      showSettings: false,
      settings: {
        movementSpeed: 50,
        mouseSensitivity: 5,
        stickyRightMouseClick: false
      }
    };

    this.keyDown = this.keyDown.bind(this);
    this.changeSetting = this.changeSetting.bind(this);
  }

  keyDown(event) {
    if (event.key == 'Escape') {
      this.setState({showSettings: !this.state.showSettings});
    }
  }

  changeSetting(settingName: string, settingValue: any) {
    let newSetting = {};
    newSetting[settingName] = settingValue;
    this.setState({ settings: Object.assign({}, this.state.settings, newSetting)});
  }

  render() {
    return (
      <div onKeyDown={this.keyDown}>
        <Settings
          settings={this.state.settings}
          changeSetting={this.changeSetting}
          showSettings={this.state.showSettings} />
        <Canvas settings={this.state.settings} />
      </div>
    );
  }
}

export default HomePage;
