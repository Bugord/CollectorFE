import React, { Component } from "react";
import { getAllDebtsAPI } from "./debtService";
import Button from "react-materialize/lib/Button";
import Input from "react-materialize/lib/Input";
import { Row, Col, Dropdown, NavItem, Autocomplete } from "react-materialize";
import Chip from "../common/chip/chip";
import Conf from "../../configuration";
import PropTypes from "prop-types";

export default class DebtSearch extends Component {
  constructor(props) {
    super(props);
    this.InputRef = React.createRef();
    this.DropdownRef = React.createRef();

    this.state = {
      searchParameters: [
        {
          label: "My debts",
          value: "",
          type: "checkbox",
          fieldName: "DebtOwner",
          default: "false"
        },
        {
          label: "Name",
          value: "",
          type: "text",
          fieldName: "Name",
          default: ""
        },
        {
          label: "Description",
          value: "",
          type: "text",
          fieldName: "Description",
          default: ""
        },
        {
          label: "Friend",
          value: "",
          type: "autocomplete",
          fieldName: "FriendName",
          default: ""
        },
        {
          label: "Closed",
          value: "",
          type: "checkbox",
          fieldName: "isClosed",
          default: "false"
        },
        {
          label: "I owe",
          value: "",
          type: "checkbox",
          fieldName: "ReqUserOwe",
          default: "false"
        },
        {
          label: "Overdue",
          value: "",
          type: "checkbox",
          fieldName: "Overdued",
          default: "false"
        },
        {
          label: "Synchronized",
          value: "",
          type: "checkbox",
          fieldName: "IsSynchronized",
          default: "false"
        },
        {
          label: "Created after",
          value: "",
          type: "date",
          fieldName: "CreatedFrom",
          default: ""
        },
        {
          label: "Created before",
          value: "",
          type: "date",
          fieldName: "CreatedBefore",
          default: ""
        },
        {
          label: "Value less than",
          value: "",
          type: "number",
          fieldName: "ValueLessThan",
          default: ""
        },
        {
          label: "Value more Than",
          value: "",
          type: "number",
          fieldName: "ValueMoreThan",
          default: ""
        }
      ],
      editedParameter: "",
      searchValue: "",
      sortFilters: [
        { label: "Create date ▲", type: "createDateDesc" },
        { label: "Create date ▼", type: "createDateAsc" },
        { label: "Value ▲", type: "valueDesc" },
        { label: "Value ▼", type: "valueAsc" }
      ],
      currentSortFilter: ""
    };
  }

  onInputChange(event, type) {
    const value = event.target.value;
    var newState = {};
    switch (event.target.type) {
      case "checkbox":
        newState[type] = event.target.checked ? "true" : "false";
        break;
      default:
        newState[type] = value;
    }
    this.setState(newState);
  }

  arrayToObject = array =>
    array.reduce((obj, item) => {
      obj[item.name] = item.friendUser
        ? Conf.domain + item.friendUser.avatarUrl
        : Conf.domain + "images/defaultAvatar.png";
      return obj;
    }, {});

  render() {
    var friendsObject = this.arrayToObject(this.props.friends);
    return (
      <Row>
        <Col s={12}>
          <div className="search__input col s8 l7">
            {this.state.editedParameter.type === "date" ? (
              <Input
                type="date"
                s={12}
                ref={this.InputRef}
                placeholder=""
                label={
                  this.state.editedParameter
                    ? this.state.editedParameter.label
                    : "Search"
                }
                value={this.state.searchValue}
                onChange={e => {
                  if (this.state.editedParameter)
                    this.onInputChange(e, "searchValue");
                }}
                onClick={() => {
                  if (!this.state.editedParameter)
                    document
                      .getElementsByClassName("dropdown-button")[0]
                      .click();
                }}
              />
            ) : null}
            {this.state.editedParameter.type === "autocomplete" ? (
              <Autocomplete
                s={12}
                title="Friend"
                data={friendsObject}
                onAutocomplete={value => this.setState({ searchValue: value })}
              />
            ) : this.state.editedParameter.type === "date" ? (
              <div />
            ) : (
              <Input
                s={12}
                ref={this.InputRef}
                placeholder=""
                autoComplete="off"
                label={
                  this.state.editedParameter
                    ? this.state.editedParameter.label
                    : "Search"
                }
                type={
                  this.state.editedParameter
                    ? this.state.editedParameter.type
                    : "text"
                }
                value={this.state.searchValue}
                onChange={e => {
                  if (this.state.editedParameter)
                    this.onInputChange(e, "searchValue");
                }}
                onClick={() => {
                  if (!this.state.editedParameter)
                    document
                      .getElementsByClassName("dropdown-button")[0]
                      .click();
                }}
              />
            )}
          </div>
          <Col s={1}>
            <div
              className={
                this.state.editedParameter ? "search__tag-Buttons" : "hide"
              }
            >
              <Button
                floating
                icon="add"
                disabled={!this.state.searchValue.trim()}
                className="green lighten-2"
                onClick={() => {
                  this.setState(
                    {
                      searchParameters: this.state.searchParameters.map(param =>
                        param.label === this.state.editedParameter.label
                          ? {
                              ...this.state.editedParameter,
                              value: this.state.searchValue
                            }
                          : param
                      ),
                      editedParameter: "",
                      searchValue: ""
                    },
                    () => this.updateDebts(true)
                  );
                }}
              />
              <Button
                floating
                icon="close"
                onClick={() => {
                  this.setState({
                    editedParameter: "",
                    searchValue: ""
                  });
                }}
                className="red lighten-2"
              />
            </div>
          </Col>
          <Col s={12} m={3}>
            <Row>
              <Dropdown
                trigger={
                  <Button className="col s12 green lighten-2">
                    {this.state.editedParameter
                      ? this.state.editedParameter.label
                      : "Filters"}
                  </Button>
                }
              >
                {this.state.searchParameters.map(param =>
                  !param.value ? (
                    <NavItem
                      key={param.label}
                      onClick={() => {
                        this.setState({
                          editedParameter: param,
                          searchValue: param.default
                        });
                      }}
                    >
                      {param.label}
                    </NavItem>
                  ) : null
                )}
              </Dropdown>
            </Row>
            <Row>
              <Dropdown
                trigger={
                  <Button className="col s12 green lighten-2">
                    {this.state.currentSortFilter
                      ? this.state.currentSortFilter.label
                      : "Sort by"}
                  </Button>
                }
              >
                {this.state.sortFilters.map((filter, index) => (
                  <NavItem
                    key={index}
                    onClick={() => {
                      this.setState({
                        currentSortFilter: filter
                      });
                      this.props.onSortFilterChange(filter.type);
                    }}
                  >
                    {filter.label}
                  </NavItem>
                ))}
              </Dropdown>
            </Row>
          </Col>

          <Col s={12}>
            {this.state.searchParameters.map(param =>
              param.value ? (
                <Chip
                  close
                  key={param.label}
                  data={param}
                  onClose={() => {
                    this.setState(
                      {
                        searchParameters: this.state.searchParameters.map(
                          parameter =>
                            parameter.label === param.label
                              ? { ...parameter, value: "" }
                              : parameter
                        )
                      },
                      () => this.updateDebts(true)
                    );
                  }}
                />
              ) : null
            )}
          </Col>
        </Col>
      </Row>
    );
  }

  updateDebts(rewrite) {
    var searchParameters = { ...this.state.searchParameters };
    getAllDebtsAPI(this.props.debtsCount, rewrite, searchParameters);
  }
}

DebtSearch.propTypes = {
  friends: PropTypes.array,
  debtsCount: PropTypes.number
};
