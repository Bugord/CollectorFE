import React from "react";
import ReactExport from "react-data-export";
import { connect } from "react-redux";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Download extends React.Component {
  render() {
    var debts = Object.assign([], this.props.debts)
    debts.forEach(debt => {
      debt.friend = this.props.friends.find(
          friend => friend.id === debt.friendId
        );
    });

    return (
      <ExcelFile element={this.props.button} >
        <ExcelSheet data={debts} name="Debts">
          <ExcelColumn label="Name" value="name" />
          <ExcelColumn
            label="Value"
            value={debt =>
              debt.isOwner === debt.isOwnerDebter ? -debt.value : debt.value
            }
          />
          <ExcelColumn label="Description" value="description" />
          <ExcelColumn label="You owner" value="isOwner" />
          <ExcelColumn label="Date" value="created" />
          <ExcelColumn label="Is closed" value="isClosed" />
          <ExcelColumn label="Overdue date"  value={debt =>
              debt.dateOfOverdue ? debt.dateOfOverdue : "NULL"
            } />
          <ExcelColumn
            label="Friend email"
            value={debt =>
              debt.friend.friendUser ? debt.friend.friendUser.email : "NULL"
            }
          />
          <ExcelColumn
            label="Friend first name"
            value={debt =>
              debt.friend.friendUser ? debt.friend.friendUser.firstName : "NULL"
            }
          />
          <ExcelColumn
            label="Friend last name"
            value={debt =>
              debt.friend.friendUser ? debt.friend.friendUser.lastName : "NULL"
            }
          />
        </ExcelSheet>
      </ExcelFile>
    );
  }
}

const mapStateToProps = state => {
  return {
    debts: state.debtsApp.debts,
    friends: state.friendsApp.friends
  };
};

export default (Download = connect(mapStateToProps)(Download));
