import * as React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from 'material-ui/TextField';

const styles = require("./layerItemRenamer.theme.scss");

interface State {
  newName: string;
  open: boolean;
}

interface Props {
  name: string;
  onRename: (name: string, newName: string) => boolean;
  doOpen: boolean;
}


export class LayerItemRenamerComponent extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      newName: props.name,
      open: props.doOpen,
    };
  }

  private handleRename = (event) => {
    if (this.props.onRename(this.props.name, this.state.newName)) {
      this.handleCancel(event);
    }
  }

  private handleCancel = (event) => {
    this.setState({
      ...this.state,
      open: false,
    });
  }

  private handleNameChange = (event, newValue: string) => {
    this.setState({
      ...this.state,
      open: false,
    });
  }

  public render() {
    const dialogButtons = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleRename}
      />,
    ];

    return(
      <Dialog className={styles.layerItemRenamer}
          title="Rename Layer"
          actions={dialogButtons}
          modal={true}
          open={this.state.open}
        >
          <TextField
            defaultValue={this.state.newName}
            floatingLabelText="New Name"
            onChange={this.handleNameChange}
          />
        </Dialog>
    );
  }
}