import React, { Component } from "react";
import { getAllDebtsAPI } from "./debtService";
import Button from "react-materialize/lib/Button";
import Input from "react-materialize/lib/Input";
import {
  Icon,
  Row,
  Col,
  Dropdown,
  NavItem,
  Autocomplete
} from "react-materialize";
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
      searchValue: ""
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
          {this.state.editedParameter.type === "autocomplete" ? (
            <Autocomplete
              s={9}
              l={8}
              title="Friend"
              data={friendsObject}
              onAutocomplete={value => this.setState({ searchValue: value })}
            >
              <Icon>search</Icon>
            </Autocomplete>
          ) : (
            <Input
              s={9}
              l={8}
              ref={this.InputRef}
              placeholder=""
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
                  document.getElementsByClassName("dropdown-button")[0].click();
              }}
            >
              <Icon>search</Icon>
            </Input>
          )}
          <Col
            s={2}
            l={1}
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
          </Col>
          <Col s={12} m={3}>
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
      //   <div>
      //     <Row>
      //       {this.state.editedParameter.type === "autocomplete" ? (
      //         <Autocomplete
      //           s={10}
      //           title="Friend"
      //           data={friendsObject}
      //           onAutocomplete={value => this.setState({ searchValue: value })}
      //         >
      //           <Icon>search</Icon>
      //         </Autocomplete>
      //       ) : (
      //         <Input
      //           s={10}
      //           ref={this.InputRef}
      //           placeholder=""
      //           label={
      //             this.state.editedParameter
      //               ? this.state.editedParameter.label
      //               : "Search"
      //           }
      //           type={
      //             this.state.editedParameter
      //               ? this.state.editedParameter.type
      //               : "text"
      //           }
      //           value={this.state.searchValue}
      //           onChange={e => {
      //             if (this.state.editedParameter)
      //               this.onInputChange(e, "searchValue");
      //           }}
      //           onClick={() => {
      //             if (!this.state.editedParameter)
      //               document
      //                 .getElementsByClassName("dropdown-button")[0]
      //                 .click();
      //           }}
      //         >
      //           <Icon>search</Icon>
      //         </Input>
      //       )}

      //       <div
      //         className={
      //           this.state.editedParameter ? "search__tag-Buttons" : "hide"
      //         }
      //       >
      //         <Button
      //           floating
      //           icon="add"
      //           disabled={!this.state.searchValue.trim()}
      //           className="green lighten-2"
      //           onClick={() => {
      //             this.setState(
      //               {
      //                 searchParameters: this.state.searchParameters.map(param =>
      //                   param.label === this.state.editedParameter.label
      //                     ? {
      //                         ...this.state.editedParameter,
      //                         value: this.state.searchValue
      //                       }
      //                     : param
      //                 ),
      //                 editedParameter: "",
      //                 searchValue: ""
      //               },
      //               () => this.updateDebts(true)
      //             );
      //           }}
      //         />
      //         <Button
      //           floating
      //           icon="close"
      //           onClick={() => {
      //             this.setState({
      //               editedParameter: "",
      //               searchValue: ""
      //             });
      //           }}
      //           className="red lighten-2"
      //         />
      //       </div>
      //     </Row>
      //     <Col s={12}>
      //       {this.state.searchParameters.map(param =>
      //         param.value ? (
      //           <Chip
      //             close
      //             key={param.label}
      //             data={param}
      //             onClose={() => {
      //               this.setState(
      //                 {
      //                   searchParameters: this.state.searchParameters.map(
      //                     parameter =>
      //                       parameter.label === param.label
      //                         ? { ...parameter, value: "" }
      //                         : parameter
      //                   )
      //                 },
      //                 () => this.updateDebts(true)
      //               );
      //             }}
      //           />
      //         ) : null
      //       )}
      //     </Col>
      //     <Col s={12}>
      //       <Dropdown trigger={<div ref={el => (this.el = el)} />}>
      //         {this.state.searchParameters.map(param =>
      //           !param.value ? (
      //             <NavItem
      //               key={param.label}
      //               onClick={() => {
      //                 this.setState({
      //                   editedParameter: param,
      //                   searchValue: param.default
      //                 });
      //               }}
      //             >
      //               {param.label}
      //             </NavItem>
      //           ) : null
      //         )}
      //       </Dropdown>
      //     </Col>
      //   </div>
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
