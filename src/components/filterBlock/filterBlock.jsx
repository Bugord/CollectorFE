import React, { Component } from "react";
import NewFilter from "./newFilter";
import Chip from "../common/chip/chip";
import cx from "classnames";
import { getAllDebtsAPI } from "../debt/debtService";
import Conf from "../../configuration";

export default class FilterBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNewFilter: false,

      selectedFilters: [],
      searchFilters: [
        {
          label: "Type",
          type: "bool",
          nameOn: "Money",
          nameOff: "Thing",
          fieldName: "IsMoney",
        },
        {
          label: "Debt owner",
          type: "bool",
          fieldName: "DebtOwner",
          nameOn: "My debt",
          nameOff: "Friends debt"
        },
        {
          label: "Owe",
          type: "bool",
          fieldName: "ReqUserOwe",
          nameOn: "I owe",
          nameOff: "Owe to me"
        },
        {
          label: "Overdue",
          type: "bool",
          fieldName: "Overdued",
          nameOn: "Overdue",
          nameOff: "Not overdue"
        },
        {
          label: "Closed",
          type: "bool",
          fieldName: "isClosed",
          nameOn: "Closed",
          nameOff: "Open"
        },
        {
          label: "Synchronize",
          type: "bool",
          fieldName: "IsSynchronized",
          nameOn: "Synchronized",
          nameOff: "Not synchronized"
        },
        {
          label: "Description",
          type: "text",
          fieldName: "Description"
        },
        {
          label: "Name",
          type: "text",
          fieldName: "Name"
        },
        {
          label: "Created after",
          type: "date",
          fieldName: "CreatedFrom"
        },
        {
          label: "Created before",
          type: "date",
          fieldName: "CreatedBefore"
        },
        {
          label: "Value less than",
          type: "number",
          fieldName: "ValueLessThan"
        },
        {
          label: "Value more Than",
          type: "number",
          fieldName: "ValueMoreThan"
        },
        {
          label: "Friend",
          type: "autocomplete",
          fieldName: "FriendName"
        }
      ]
    };
  }

  arrayToObject = array =>
    array.reduce((obj, item) => {
      obj[item.name] = item.friendUser
        ? Conf.domain + item.friendUser.avatarUrl
        : Conf.domain + "images/defaultAvatar.png";
      return obj;
    }, {});

  onFilterAdd(filter) {
    this.setState(
      {
        selectedFilters: [...this.state.selectedFilters, filter],
        showNewFilter: false
      },
      () => this.updateDebts()
    );
  }

  updateDebts() {
    var selectedFilters = { ...this.state.selectedFilters };
    getAllDebtsAPI(this.props.debts.length, true, selectedFilters);
  }

  render() {
    return (
      <div className="filterBlock">
        {/* <h4>Filters</h4> */}
        <div
          className={cx(
            "newFilterBlock",
            this.state.showNewFilter ? "open" : ""
          )}
        >
            <NewFilter
              searchFilters={this.state.searchFilters.filter(
                filter =>
                  !this.state.selectedFilters.find(
                    sFilter => sFilter.label === filter.label
                  )
              )}
              onFilterAdd={filter => this.onFilterAdd(filter)}
              friendsObject={this.arrayToObject(this.props.friends)}
            />


          
        </div>
        <div className="floatClear" />

        {this.state.selectedFilters.map(filter => (
          <Chip
            close
            key={filter.label}
            data={filter}
            onClose={() => {
              this.setState(
                {
                  selectedFilters: this.state.selectedFilters.filter(
                    sFilter => sFilter.label !== filter.label
                  )
                },
                () => this.updateDebts()
              );
            }}
          />
        ))}
      </div>
    );
  }
}
