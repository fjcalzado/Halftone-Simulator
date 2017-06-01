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
  onNameChange: (editingName: string) => void;
  onAddLayer: (newName: string) => void;
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
    this.props.onAddLayer(this.props.name);
  }

  private handleKeyPress = (event) => {
    if ((event.key === "Enter") && !this.calculateDisabled()) {
      this.handleClickAdd(event);
    }
  }

  private handleNameChange = (event, newValue: string) => {
    this.props.onNameChange(newValue);
  }

  private calculateDisabled = (): boolean => {
    return (this.props.disabled || Boolean(this.props.error) || !this.props.name);
  }

  // As a function because it must be recalculated on each render().
  private ButtonAdd = () => {
    return (
      <IconButton className={this.props.theme.button}
        disabled={this.calculateDisabled()}
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
          type="text"
          name="addLayer_name"
          label={"Add New Layer"}
          value={this.props.name}
          error={this.props.error}
          onChange={this.handleNameChange.bind(this, "addLayer_name")}
          onKeyPress={this.handleKeyPress}
          maxLength={20}
        />
      </div>
    );
  }
}
export const LayerAdderComponent = themr(identifiers.layerAdder)(LayerAdder);
