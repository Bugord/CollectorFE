import React, { Component } from "react";
import { connect } from "react-redux";
import AcceptFriendBlock from "../notifications/acceptFriendBlock";
import { addDebtAPI, removeDebtAPI, updateDebtAPI } from "./debtService";
import { debtsError, debtsViewed, debtChangesNewDebt } from "./debtsActions";
import { Card, CardTitle } from "react-materialize";
import Icon from "react-materialize/lib/Icon";
import swal from "sweetalert";
import ReactModal from "react-modal";
import ContentEditable from "react-contenteditable";
import Input from "react-materialize/lib/Input";
import Conf from "../../configuration";
import { convertLocalDateToUTCDate } from "../common/helperFunctions";
import { compose } from "redux";
import PropTypes from "prop-types";
import { showError, showMessage } from "../common/helperFunctions";

const customStyles = {
  content: {
    top: "12%",
    position: "relative"
  },
  overlay: {
    position: "fixed",
    top: "0px",
    left: "0px",
    right: "0px",
    bottom: "0px",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    marginBottom: "0px",
    zIndex: "40"
  }
};

class DebtBlock extends Component {
  constructor(props) {
    super(props);

    this.descriptionRef = React.createRef();
    this.nameRef = React.createRef();
    this.overdueDateInputRef = React.createRef();

    let { debt } = this.props;
    let friend = debt
      ? this.props.friends.find(friend => friend.id === debt.friendId)
      : {};
    this.state = {
      editable: this.props.editable || false,
      active: false,
      changes: [],
      test: this.props.debt,
      modalIsOpen: false,
      friendPopupOpen: false,
      friends: this.props.friends,
      oldDebt: debt
        ? {
            ...debt,
            dateOfOverdue: debt.dateOfOverdue
              ? new Date(debt.dateOfOverdue)
              : ""
          }
        : {},
      debt: debt
        ? {
            ...debt,
            friend: friend ? friend : {},
            dateOfOverdue: debt.dateOfOverdue
              ? new Date(debt.dateOfOverdue)
              : ""
          }
        : {
            description: "Description",
            value: 0,
            synchronize: false,
            isOwnerDebter: false,
            name: "Name",
            friend: { name: "Select friend" },
            dateOfOverdue: "",
            created: new Date(),
            isClosed: false,
            isOwner: true
          },
      edited: false
    };
  }

  edited() {
    if (!this.props.debt) return true;
    let { oldDebt, debt } = this.state;
    var edited = !(
      oldDebt.description === debt.description &&
      oldDebt.value === debt.value &&
      oldDebt.synchronize === debt.synchronize &&
      oldDebt.isOwnerDebter === debt.isOwnerDebter &&
      oldDebt.name === debt.name &&
      oldDebt.friend.id === debt.friend.id &&
      oldDebt.dateOfOverdue === debt.dateOfOverdue &&
      oldDebt.isClosed === debt.isClosed
    );
    return edited;
  }

  validateLate() {
    var valid = true;
    var { name, value, friend, description } = this.state.debt;
    if (name.length > 100 || name.length <= 0) {
      valid = false;
      showError("Name length must be between 1 and 100");
    }
    if (isNaN(value)) {
      valid = false;
      showError("Value is not a number");
    } else if (value < 0) {
      valid = false;
      showError("Value must be more than 0");
    }
    if (friend.id === undefined) {
      valid = false;
      showError("You have not selected friend");
    }
    if (description.length > 256) {
      valid = false;
      showError("Description length must be less than 256");
    }

    return valid;
  }

  renderDebtIcons(debt, editable) {
    let date = new Date(debt.created);

    return (
      <div
        className={
          editable ? "debt__icons editable" : "debt__icons pointer__disabled"
        }
      >
        <div className="debt__icon">
          <span className="debt__icon__day">{date.getDate()}</span>
          <span className="debt__icon__month">
            {date.toLocaleString("en-us", { month: "short" })}
          </span>
        </div>
        <div className="debt__icon">
          {debt.isMoney ? <Icon>payments</Icon> : <Icon>work</Icon>}
        </div>
        <div className={debt.dateOfOverdue || editable ? "debt__icon" : "hide"}>
          {debt.dateOfOverdue ? (
            <div>
              <span className="debt__icon__day">
                {debt.dateOfOverdue.getDate()}
              </span>
              <span className="debt__icon__month">
                {debt.dateOfOverdue.toLocaleString("en-us", {
                  month: "short"
                })}
              </span>
            </div>
          ) : (
            <Icon>event</Icon>
          )}
          <Input
            type="date"
            className="browser-default"
            onChange={(e, value) => {
              if (value)
                this.setState({
                  debt: {
                    ...debt,
                    dateOfOverdue: new Date(
                      new Date(value).getTime() -
                        new Date().getTimezoneOffset() * 60000
                    )
                  }
                });
              else this.setState({ debt: { ...debt, dateOfOverdue: "" } });
            }}
          />
        </div>
        <div
          className={
            debt.isOwner
              ? debt.synchronize
                ? "debt__icon"
                : "debt__icon debt__icon--disabled"
              : "hide"
          }
          onClick={() =>
            this.setState({
              debt: { ...debt, synchronize: !debt.synchronize }
            })
          }
        >
          <Icon>import_export</Icon>
        </div>
        <div
          onClick={() => this.setState({ editable: true })}
          className={
            debt.isOwner && this.props.zoomed && !this.state.editable
              ? "debt__icon debt__icon__edit"
              : "hide"
          }
        >
          <Icon>edit</Icon>
        </div>
      </div>
    );
  }

  renderActions(debt, editable) {
    return this.props.zoomed
      ? editable
        ? [
            <a
              key={0}
              onClick={() => {
                if (this.edited())
                  swal({
                    title: "Save all changes?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                  }).then(willDelete => {
                    if (willDelete) {
                      this.updateDebt();
                    }
                  });
                else this.props.handleCloseModal();
              }}
            >
              Save
            </a>,
            <a
              key={1}
              onClick={() => {
                if (this.edited())
                  swal({
                    title: "Cancel all changes?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                  }).then(willDelete => {
                    if (willDelete) {
                      this.setState({
                        editable: false,
                        debt: this.state.oldDebt
                      });
                    }
                  });
                else this.setState({ editable: false });
              }}
            >
              Cancel
            </a>
          ]
        : [
            <a
              key="0"
              onClick={() => {
                this.setState(
                  { debt: { ...debt, isClosed: !debt.isClosed } },
                  () => this.updateDebt()
                );
              }}
              className={debt.isOwner ? "" : "hide"}
            >
              {debt.isClosed ? "Reopen" : "Close"}
            </a>,
            <a
              key="1"
              onClick={() => this.setState({ editable: true })}
              className={debt.isOwner ? "" : "hide"}
            >
              Edit
            </a>,
            <a
              key={debt.id}
              onClick={() =>
                swal({
                  title: "Are you sure?",
                  text: debt.isOwner
                    ? "You want to remove debt"
                    : "You want to hide debt",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true
                }).then(willDelete => {
                  if (willDelete) {
                    this.removeDebt(debt.id);
                  }
                })
              }
            >
              {debt.isOwner ? "Remove" : "Hide"}
            </a>,
            <a
              key={"change"}
              onClick={() => {
                this.props.openModalDebtChanges(debt.id);
              }}
            >
              <div>Change history</div>
            </a>
          ]
      : this.props.new
      ? [
          <a
            key={0}
            onClick={() => {
              this.addDebt();
            }}
          >
            Save
          </a>,
          <a
            key={1}
            onClick={() => {
              if (this.edited())
                swal({
                  title: "Cancel all changes?",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true
                }).then(willDelete => {
                  if (willDelete) {
                    this.props.handleCloseModal();
                  }
                });
              else this.props.handleCloseModal();
            }}
          >
            Cancel
          </a>
        ]
      : null;
  }

  render() {
    let { debt } = this.state;
    let { editable } = this.state;

    return (
      <div className={debt.isClosed ? "card__item closed" : "card__item"}>
        <Card
          className={this.state.editable ? "hoverable editable" : "hoverable"}
          header={
            <CardTitle
              image={require("../../images/TitleImage.png")}
              title="Card Title"
              onClick={() => {
                if (this.props.zoomed) return;
                this.openModal();
              }}
            >
              <div
                className={
                  debt.isOwnerDebter === debt.isOwner
                    ? "card-title-inner red lighten-1"
                    : "card-title-inner green lighten-1"
                }
              >
                <div
                  className={
                    debt.isOwnerDebter === debt.isOwner
                      ? "card__arrow card__arrow--up"
                      : "card__arrow card__arrow--down"
                  }
                  onClick={() => {
                    if (!editable) return;
                    this.setState({
                      debt: {
                        ...debt,
                        isOwnerDebter: !debt.isOwnerDebter
                      }
                    });
                  }}
                >
                  <Icon large>arrow_back</Icon>
                </div>
                <div className="truncate card-title-info">
                  <div
                    className={
                      editable
                        ? "debtBlock__value editable"
                        : "debtBlock__value"
                    }
                  >
                    <ContentEditable
                      disabled={!editable}
                      html={debt.value.toString()}
                      onChange={e => this.onInputChange(e, "value")}
                    />
                    <div> BYN</div>
                  </div>
                  <div
                    className="debtBlock__friend"
                    onClick={() => {
                      if (editable) this.setState({ friendPopupOpen: true });
                    }}
                  >
                    <img
                      className="friend__icon"
                      src={
                        debt.friend.friendUser
                          ? Conf.domain + debt.friend.friendUser.avatarUrl
                          : Conf.domain + "images/defaultAvatar.png"
                      }
                      alt="friendIcon"
                    />
                    {debt.friend.name}
                  </div>
                </div>
              </div>
            </CardTitle>
          }
          actions={this.renderActions(debt, editable)}
        >
          {this.renderDebtIcons(debt, editable)}
          {this.props.zoomed && !this.state.editable ? (
            <div
              className="debtBlock__closeButton"
              onClick={() => this.props.handleCloseModal()}
            >
              <Icon>close</Icon>
            </div>
          ) : null}
          {this.state.friendPopupOpen ? (
            <AcceptFriendBlock
              togglePopup={() => this.togglePopup()}
              onSelect={friend => {
                this.setState({
                  debt: { ...debt, friend: friend, friendId: friend.id }
                });
                this.togglePopup();
              }}
            />
          ) : null}

          <div
            className={
              this.props.zoomed
                ? "card-content-inner.active"
                : "card-content-inner"
            }
          >
            <ContentEditable
              className="card-title grey-text text-darken-4"
              disabled={!editable}
              html={debt.name}
              onChange={e => this.onInputChange(e, "name")}
              spellCheck="false"
              onPaste={e => this.handlePaste(e)}
              ref={this.nameRef}
              onFocus={() => {
                if (debt.name === "Name" && this.props.new)
                  this.setState({ debt: { ...this.state.debt, name: "" } });
              }}
              onBlur={() => {
                if (this.state === "" && this.props.new)
                  this.setState({ debt: { ...this.state.debt, name: "Name" } });
              }}
            />
            <ContentEditable
              disabled={!editable}
              html={debt.description}
              onChange={e => this.onInputChange(e, "description")}
              className="card-text"
              ref={this.descriptionRef}
              spellCheck="false"
              onPaste={e => this.handlePaste(e)}
              onFocus={() => {
                if (debt.description === "Description" && this.props.new)
                  this.setState({
                    debt: { ...this.state.debt, description: "" }
                  });
              }}
              onBlur={() => {
                if (this.state.description === "" && this.props.new)
                  this.setState({
                    debt: { ...this.state.debt, description: "Description" }
                  });
              }}
            />
          </div>
        </Card>

        <ReactModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => this.closeModal()}
          style={customStyles}
          ariaHideApp={false}
          className="col s12 m10 l6 xl4 offset-m1 offset-l3 offset-xl4"
          portalClassName=""
          overlayClassName="row"
        >
          {/* <div className="col s12 m10 l6 xl4 offset-m1 offset-l3 offset-xl4"> */}
          <DebtBlock
            debt={Object.assign({}, debt)}
            openModalDebtChanges={this.props.openModalDebtChanges}
            friends={this.props.friends}
            // editable={debt.isOwner && !debt.isClosed}
            zoomed
            handleCloseModal={() => this.closeModal()}
          />
          {/* </div> */}
        </ReactModal>
      </div>
    );
  }

  openModal() {
    if (!this.props.editable) this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.debt) {
      let friend = nextProps.friends.find(
        friend => friend.id === nextProps.debt.friendId
      );
      this.setState({
        debt: {
          ...nextProps.debt,
          friend: friend ? friend : {},
          dateOfOverdue: nextProps.debt.dateOfOverdue
            ? new Date(nextProps.debt.dateOfOverdue)
            : ""
        }
      });
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  setDebtState() {
    var { debt } = this.props;
    if (debt)
      this.setState({
        name: debt.name,
        description: debt.description,
        isYouDebter: debt.isOwner === debt.isOwnerDebter,
        value: debt.value,
        friend: debt.friend,
        synchronize: debt.synchronize
      });
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handlePaste(e) {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData("text/plain");

    if (document.queryCommandSupported("insertText")) {
      document.execCommand("insertText", false, text);
    } else {
      document.execCommand("paste", false, text);
    }
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        editable: false,
        showAddFields: false,
        nameError: "",
        valueError: "",
        showHideButton: false,
        showFriendSearch: false
      });
      this.props.clearError();
    }
  }

  removeDebt(debtId) {
    removeDebtAPI(debtId, this.props.debt.friend.id)
      .then(() => showMessage("Debt removed successfully"))
      .catch(res => res.forEach(error => showError(error)));
  }

  addDebt() {
    if (this.validateLate())
      if (this.edited())
        swal({
          title: "Save all changes?",
          icon: "warning",
          buttons: true,
          dangerMode: true
        }).then(willDelete => {
          if (willDelete) {
            if (this.props.new)
              addDebtAPI(this.state.debt)
                .then(() => {
                  showMessage("Debt added successfully");
                  this.props.handleCloseModal();
                })
                .catch(res => res.forEach(error => showError(error)));
            else this.updateDebt();
          }
        });
      else this.props.handleCloseModal();
  }

  updateDebt() {
    let { debt } = this.state;
    if (this.validateLate())
      updateDebtAPI(
        debt.name,
        debt.friend.id,
        debt.description,
        debt.synchronize,
        debt.value,
        debt.id,
        debt.isOwnerDebter,
        debt.dateOfOverdue
          ? convertLocalDateToUTCDate(debt.dateOfOverdue)
          : debt.dateOfOverdue,
        debt.isClosed,
        debt.rowVersion,
        debt.friend.friendUser ? debt.friend.friendUser.username : ""
      )
        .then(() => {
          showMessage("Debt updated successfully");
          this.props.handleCloseModal();
        })
        .catch(res => res.forEach(error => showError(error)));
  }

  onInputChange(event, type) {
    const value = event.target.value;
    var newState = { ...this.state.debt };
    newState[type] = value;
    this.setState({ debt: newState }, () => this.validate(type));
  }

  setCaret(sel, node, caretPos, maxLength) {
    var caretPosition = caretPos <= maxLength ? caretPos : maxLength;
    var range = document.createRange();
    range.setStart(node, caretPosition);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  validate(name) {
    var valid = true;
    var sel = window.getSelection();
    var caretPos = sel.anchorOffset;

    if (this.state.debt.description.length >= 255) {
      if (name === "description")
        this.setState(
          {
            debt: {
              ...this.state.debt,
              description: this.state.debt.description.substring(0, 255)
            }
          },
          () =>
            this.setCaret(
              sel,
              this.descriptionRef.current.htmlEl.childNodes[0],
              caretPos,
              255
            )
        );
    }

    if (this.state.debt.name.length >= 100) {
      if (name === "name")
        this.setState(
          {
            debt: {
              ...this.state.debt,
              name: this.state.debt.name.substring(0, 100)
            }
          },
          () =>
            this.setCaret(
              sel,
              this.nameRef.current.htmlEl.childNodes[0],
              caretPos,
              100
            )
        );
    }

    this.setState({ valid: valid });
  }

  renderError() {
    var display =
      this.state.nameError ||
      this.state.valueError ||
      this.props.requestError ||
      false;
    return (
      <div className="errorMessage" style={{ display: display ? "" : "none" }}>
        <p>{this.state.nameError}</p>
        <p>{this.state.valueError}</p>
        <p>{this.props.requestError}</p>
      </div>
    );
  }

  togglePopup() {
    this.setState({
      friendPopupOpen: false
    });
  }
}

DebtBlock.propTypes = {
  debt: PropTypes.object,
  friend: PropTypes.array,
  asCollectionItem: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    requestError: state.debtsApp.error,
    debtLoadingId: state.debtsApp.debtLoadingId,
    stateDebts: state.debtsApp.debts
  };
};

const mapDispatchToProps = dispatch => ({
  clearError: () => dispatch(debtsError("")),
  viewed: id => dispatch(debtsViewed(id)),
  debtChangesNewDebt: id => dispatch(debtChangesNewDebt(id))
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DebtBlock)
);
