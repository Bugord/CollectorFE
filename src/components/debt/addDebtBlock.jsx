import React, { Component, Fragment } from "react";
import { Icon, Button } from "react-materialize";
import AcceptFriendBlock from "../notifications/acceptFriendBlock";
import Conf from "../../configuration";
import { Input, Row, Col } from "react-materialize";
import swal from "sweetalert";
import { NamedSwitch } from "../common/namedSwitch";
import { addDebtAPI, updateDebtAPI } from "./debtService";
import { showMessage, showError, showWarning } from "../common/helperFunctions";
import moment from "moment";
import cx from "classnames";

export class NewDebtBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friendPopupOpen: false,
      friend: {
        name: "Select friend"
      },

      disabled: !!props.debt,
      created: moment(new Date()),
      isMoney: false,
      isOwnerDebter: false,
      synchronize: false,
      value: "",
      currentValue: "",
      name: "",
      currency: this.props.currencies[0].id.toString(),
      description: "",
      dateOfOverdue: "",
      files: []
    };

    let { debt } = this.props;
    let { friend } = this.props;

    if (debt) {
      this.state = {
        ...this.state,
        value: debt.value.toString(),
        currentValue: debt.currentValue.toString(),
        isMoney: debt.isMoney,
        name: debt.name ? debt.name : "",
        isOwnerDebter: debt.isOwnerDebter,
        dateOfOverdue: debt.dateOfOverdue ? debt.dateOfOverdue : "",
        description: debt.description,
        synchronize: debt.synchronize,
        rowVersion: debt.rowVersion,
        id: debt.id,
        isClosed: debt.isClosed,
        friend: friend,
        isOwner: debt.isOwner,
        currency: debt.currencyId.toString(),
        created: moment(debt.created)
      };
    }
  }

  togglePopup() {
    this.setState({ friendPopupOpen: !this.state.friendPopupOpen });
  }

  onInputChange(event) {
    const value = event.target.value;
    let type = event.target.name;
    var newState = { ...this.state.debt };
    newState[type] = value;
    this.setState(newState);
  }

  onSubmit(e) {
    if (this.state.friend.id === undefined)
      showWarning("You have not selected friend");
    else
      swal({
        title: this.props.debt ? "Save debt changes?" : "Add new debt?",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          if (this.props.debt) this.updateDebt();
          else this.addDebt();
        }
      });

    e.preventDefault();
  }

  addDebt() {
    let debt = {
      name: this.state.isMoney ? null : this.state.name,
      friendId: this.state.friend.id,
      description: this.state.description,
      synchronize: this.state.synchronize,
      value: this.state.isMoney ? this.state.value : null,
      currentValue: this.state.currentValue,
      isOwnerDebter: this.state.isOwnerDebter,
      dateOfOverdue: this.state.dateOfOverdue,
      isMoney: this.state.isMoney,
      currencyId: this.state.currency
    };
    addDebtAPI(debt)
      .then(() => {
        showMessage("Debt added successfully");
        this.props.closeModal();
      })
      .catch(res => res.forEach(error => showError(error)));
  }

  updateDebt() {
    updateDebtAPI(
      this.state.isMoney ? null : this.state.name,
      this.state.friend.id,
      this.state.description,
      this.state.synchronize,
      this.state.isMoney ? this.state.value : null,
      this.state.isMoney ? this.state.currentValue : null,
      this.state.id,
      this.state.isOwnerDebter,
      this.state.isMoney,
      this.state.dateOfOverdue,
      // ? convertLocalDateToUTCDate(this.state.dateOfOverdue)
      // : this.state.dateOfOverdue,
      this.state.isClosed,
      this.state.rowVersion,
      this.state.friend.friendUser ? this.state.friend.friendUser.username : "",
      this.state.currency
    )
      .then(() => {
        showMessage("Debt updated successfully");
        this.props.closeModal();
      })
      .catch(res => showError(res));
  }

  render() {
    let dateOfOverdue = this.state.dateOfOverdue;
    return (
      <div
        className={cx(
          "debt__new",
          "z-depth-3",
          this.state.disabled ? "disabled" : ""
        )}
      >
        <div className="debt__top">
          <div className="debt-title">
            <Icon>add_box</Icon>
            <span>Add new debt</span>
          </div>
          <div className="debt-createDate">
            {this.state.created.format("DD MMM YYYY")}
          </div>
          <div
            className="user-info"
            onClick={() => this.setState({ friendPopupOpen: true })}
            disabled={this.state.disabled}
          >
            <img
              className="icon"
              alt={this.state.friend.name}
              src={
                this.state.friend.friendUser
                  ? Conf.domain + this.state.friend.friendUser.avatarUrl
                  : Conf.domain + "images/defaultAvatar.png"
              }
            />
            <div className="name">{this.state.friend.name}</div>
          </div>

          <div className="debt-switches">
            <NamedSwitch
              onChange={e => this.setState({ isMoney: e.target.checked })}
              checked={this.state.isMoney}
              nameOn="Money"
              nameOff="Thing"
              disabled={this.state.disabled}
            />
            <NamedSwitch
              onChange={e => this.setState({ isOwnerDebter: e.target.checked })}
              checked={this.state.isOwnerDebter}
              nameOn="You owe"
              nameOff="Owe to you"
              disabled={this.state.disabled}
            />
            <NamedSwitch
              onChange={e => this.setState({ synchronize: e.target.checked })}
              checked={this.state.synchronize}
              nameOn="Synchronized"
              nameOff="Not synchronized"
              disabled={this.state.disabled}
            />
          </div>
          {this.state.friendPopupOpen ? (
            <AcceptFriendBlock
              togglePopup={() => this.togglePopup()}
              onSelect={friend => {
                this.setState({ friend: friend });
                this.togglePopup();
              }}
            />
          ) : null}
        </div>
        <div className="debt__bottom">
          <form
            onSubmit={e => {
              this.onSubmit(e);
            }}
          >
            <Row className="debt__labels">
              <Row>
                {this.state.isMoney ? (
                  <Fragment>
                    <Col s={11}>
                      <Input
                        type="number"
                        s={8}
                        label="Value"
                        name="value"
                        min={0}
                        value={this.state.value}
                        onChange={e => this.onInputChange(e)}
                        validate={this.state.isMoney}
                        required
                        disabled={this.state.disabled}
                      >
                        <Icon>attach_money</Icon>
                      </Input>
                      <Input
                        type="select"
                        label="Currency"
                        s={4}
                        name="currency"
                        value={this.state.currency}
                        onChange={e => {
                          this.onInputChange(e);
                        }}
                        disabled={this.state.disabled}
                      >
                        {this.props.currencies.map(currency => (
                          <option value={currency.id} key={currency.id}>
                            {currency.currencySymbol}
                          </option>
                        ))}
                        {/* <option value="1">$</option>
                        <option value="2">RUB</option>
                        <option value="3">BYN</option> */}
                        {/* <option value="2">BYN</option> */}
                        {/* <option value="3">RUB</option> */}
                      </Input>
                    </Col>
                    <Col s={11}>
                      <Input
                        type="number"
                        s={8}
                        label="Current value"
                        name="currentValue"
                        min={0}
                        max={this.state.value}
                        value={this.state.currentValue}
                        onChange={e => this.onInputChange(e)}
                        validate={this.state.isMoney}
                        required
                        disabled={this.state.disabled}
                      >
                        <Icon>attach_money</Icon>
                      </Input>
                    </Col>
                  </Fragment>
                ) : (
                  <Col s={11}>
                    <Input
                      type="text"
                      label="Name"
                      s={12}
                      name="name"
                      onChange={e => this.onInputChange(e)}
                      value={this.state.name}
                      validate={!this.state.isMoney}
                      required
                      minLength={3}
                      maxLength={100}
                      disabled={this.state.disabled}
                    >
                      <Icon>work</Icon>
                    </Input>
                  </Col>
                )}
              </Row>
              <Row>
                <Col s={11}>
                  <Input
                    type="text"
                    s={12}
                    label="Description"
                    name="description"
                    onChange={e => this.onInputChange(e)}
                    value={this.state.description}
                    validate
                    maxLength={256}
                    disabled={this.state.disabled}
                  >
                    <Icon>comment</Icon>
                  </Input>
                </Col>
              </Row>
              <Row>
                <Col s={11}>
                  <Input
                    type="date"
                    s={12}
                    label="Overdue date"
                    name="dateOfOverdue"
                    onChange={e => this.onInputChange(e)}
                    // value={this.state.dateOfOverdue}
                    options={{
                      onStart: function() {
                        if (dateOfOverdue)
                          this.set("select", moment(dateOfOverdue));
                      }
                    }}
                    disabled={this.state.disabled}
                  >
                    <Icon>date_range</Icon>
                  </Input>
                </Col>
              </Row>
            </Row>
            {/* <Row>
              <div className="debt__dropzone" id="debtDropzone">
                {!this.state.files.length ? <span>Drop files here</span> : null}
              </div>
              <DropzoneComponent
                config={{
                  postUrl: "no-url",
                  dropzoneSelector: "#debtDropzone"
                }}
                eventHandlers={{
                  addedfile: file => {
                    this.setState({
                      ...this.state,
                      files: [...this.state.files, file]
                    });
                  },
                  removedfile: file => {
                    this.setState({
                      ...this.state,
                      files: this.state.files.filter(
                        removedFile => removedFile !== file
                      )
                    });
                  }
                }}
                djsConfig={{
                  addRemoveLinks: true,
                  autoProcessQueue: false,
                  previewTemplate: ReactDOMServer.renderToStaticMarkup(
                    <div className="dz-preview dz-file-preview">
                      <div className="dz-details">
                        <img data-dz-thumbnail="true" />
                      </div>
                      <div className="dz-progress">
                        <span
                          className="dz-upload"
                          data-dz-uploadprogress="true"
                        />
                      </div>
                      <div className="dz-error-message">
                        <span data-dz-errormessage="true" />
                      </div>
                    </div>
                  )
                }}
              />
            </Row> */}
            <Row>
              {this.state.disabled ? (
                this.state.isOwner && (
                  <Col m={6} s={10} offset="m3 s1">
                    <div>
                      <Button
                        type="button"
                        className="col s12 green lighten-2"
                        onClick={() => this.setState({ disabled: false })}
                      >
                        Edit
                      </Button>
                    </div>
                  </Col>
                )
              ) : (
                <Fragment>
                  <Col s={10} m={4} offset="s1 m1">
                    <Button type="submit" className="col s12 green lighten-2">
                      {this.props.debt ? "Save" : "Add"}
                    </Button>
                  </Col>
                  <Col s={10} m={4} offset="s1 m2">
                    <Button
                      type="button"
                      className="col s12 red lighten-2"
                      onClick={() =>
                        swal({
                          title: this.props.debt
                            ? "Cancel debt saving?"
                            : "Cancel debt adding?",
                          icon: "warning",
                          buttons: true,
                          dangerMode: true
                        }).then(willDelete => {
                          if (willDelete) {
                            this.props.closeModal();
                          }
                        })
                      }
                    >
                      Cancel
                    </Button>
                  </Col>
                </Fragment>
              )}
            </Row>
          </form>
        </div>
      </div>
    );
  }
}
