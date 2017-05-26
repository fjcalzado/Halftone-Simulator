/******************* IMPORT *******************/
import * as React from "react";
import { themr } from "react-css-themr";
import { Input } from "react-toolbox/lib/input";
import { IconButton } from "react-toolbox/lib/button";

import { identifiers } from "../../../../identifiers";


/******************* INTERFACE *******************/

interface Props {
  disabled: boolean;
  name: string;
  onNameChange: (newName: string) => void;
  onAdd: (newName: string) => void;
  error?: string;

  // Context theme API.
  theme?: {
    container: string;
    textInput: string;
    button: string;
  };
}


/******************* COMPONENT *******************/

class LayerAdder extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  private handleClickAdd = (event) => {
    this.props.onAdd(this.props.name);
  }

  private handleNameChange = (event, newValue: string) => {
    this.props.onNameChange(newValue);
  }

  private shouldDisableAddButton = (): boolean => {
    // Add button should not be available when a name validation
    // error is present or whenever the name is empty or whitespaced only.
    return Boolean(this.props.error) || /^\s*$/.test(this.props.name);
  }

  private ButtonAdd = () => {
    return (
      <IconButton className={this.props.theme.button}
        disabled={this.props.disabled || this.shouldDisableAddButton()}
        icon="add" accent
        onClick={this.handleClickAdd}
      />
    );
  }

  public render() {
    return(
     <div className={this.props.theme.container}>
        {this.ButtonAdd()}
        <Input className={this.props.theme.textInput}
          disabled={this.props.disabled}
          type="text"
          name="addLayer_name"
          label={"Add New Layer"}
          value={this.props.name}
          error={this.props.error}
          onChange={this.handleNameChange.bind(this, "addLayer_name")}
          maxLength={20}
        />
      </div>
    );
  }
}
export const LayerAdderComponent = themr(identifiers.layerAdder)(LayerAdder);
