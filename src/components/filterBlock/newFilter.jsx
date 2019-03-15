import React, { Component } from "react";
import { Button, Dropdown, Col, Autocomplete } from "react-materialize";
import Input from "react-materialize/lib/Input";
import NavItem from "react-materialize/lib/NavItem";
import { NamedSwitch } from "../common/namedSwitch";
import Icon from "react-materialize/lib/Icon";

export default class NewFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchFilter: "",
      selectedFilter: "",
      isMoney: false,
      friendsObject: props.friendsObject
    };
  }

  renderValueBlock(type) {
    switch (type) {
      default:
      case "text":
      case "number":
        return (
          <Input
            s={12}
            placeholder={this.state.selectedFilter.label}
            type={type}
            className="no-padding"
            onChange={e =>
              this.setState({
                selectedFilter: {
                  ...this.state.selectedFilter,
                  value: e.target.value
                }
              })
            }
            value={this.state.selectedFilter.value}
          />
        );
      case "date":
        return (
          <div>
            <Input
              s={12}
              placeholder={this.state.selectedFilter.label}
              type={type}
              className="no-padding"
              onChange={e =>
                this.setState({
                  selectedFilter: {
                    ...this.state.selectedFilter,
                    value: e.target.value
                  }
                })
              }
              value={this.state.selectedFilter.value}
            />
          </div>
        );
      case "bool":
        return (
          <NamedSwitch
            onChange={e =>
              this.setState({
                selectedFilter: {
                  ...this.state.selectedFilter,
                  value: e.target.checked
                }
              })
            }
            checked={this.state.selectedFilter.value}
            nameOn={this.state.selectedFilter.nameOn}
            nameOff={this.state.selectedFilter.nameOff}
          />
        );
      case "autocomplete":
        return (
          <Autocomplete
            s={12}
            title="Friend"
            data={this.state.friendsObject}
            onAutocomplete={value =>
              this.setState({
                selectedFilter: {
                  ...this.state.selectedFilter,
                  value: value
                }
              })
            }
          />
        );
    }
  }

  render() {
    return (
      <div className="newFilter">
        <Col s={4} className="no-padding">
          <Dropdown
            options={{ belowOrigin: true }}
            trigger={
              <Button className="col s12 green lighten-2">
                {this.state.selectedFilter.label || "Select filter"}
              </Button>
            }
          >
            {this.props.searchFilters.map((filter, index) => (
              <NavItem
                key={index}
                onClick={() =>
                  this.setState({
                    selectedFilter: {
                      ...filter,
                      value: filter.type === "bool" ? false : ""
                    }
                  })
                }
              >
                {filter.label}
              </NavItem>
            ))}
          </Dropdown>
        </Col>
        <Col s={7} className="newFilter__value">
          {this.state.selectedFilter &&
            this.renderValueBlock(this.state.selectedFilter.type)}
        </Col>
        <Col s={1}>
          {this.state.selectedFilter && (
            <div
              className="newFilter__addButton"
              onClick={() => {
                this.props.onFilterAdd(this.state.selectedFilter);
                this.setState({ selectedFilter: "" });
              }}
            >
              <Icon>add</Icon>
            </div>
          )}
        </Col>

        <div className="floatClear" />
      </div>
    );
  }
}
