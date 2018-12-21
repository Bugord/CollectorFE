import React, { Component } from "react";
import { connect } from "react-redux";
import AcceptFriendBlock from "../notifications/acceptFriendBlock";
import {
  addDebtAPI,
  removeDebtAPI,
  getDebtChangesAPI,
  updateDebtAPI
} from "./debtService";
import {
  debtsError,
  debtsViewed,
  debtChangesStartLoad,
  debtChangesNewDebt
} from "./debtsActions";
import { Card, CardTitle, Modal } from "react-materialize";
import Icon from "react-materialize/lib/Icon";
import swal from "sweetalert";
import ReactModal from "react-modal";
import ContentEditable from "react-contenteditable";
import Input from "react-materialize/lib/Input";
import Conf from "../../configuration";
import CollectionItem from "react-materialize/lib/CollectionItem";
import { convertLocalDateToUTCDate } from "../common/helperFunctions";
import DebtChangesBlock from "./debtChangesBlock";
import { compose } from "redux";
import PropTypes from "prop-types";

const customStyles = {
  content: {
    top: "12%",
    position: "relative"
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
            isClosed: false
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

  render() {
    if (!this.props.friends.length) return null;

    if (!this.props.editable) {
      if (this.props.asCollectionItem) return this.renderCollectionItem();
      else return this.renderRegular();
    } else return this.renderEditable();
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

  renderCollectionItem() {
    let { debt } = this.state;
    if (!debt) return null;
    return (
      <CollectionItem
        className={
          debt.isOwner === debt.isOwnerDebter
            ? "avatar with-padding-right debt debter"
            : "avatar with-padding-right debt not-debter"
        }
      >
        <img
          className="circle friend__icon"
          src={
            debt.friend.friendUser
              ? Conf.domain + debt.friend.friendUser.avatarUrl
              : Conf.domain + "images/defaultAvatar.png"
          }
          alt="friendIcon"
        />
        <span className="title">{debt.name}</span>
        <p>{debt.value + " BYN"}</p>
        <p>{debt.description}</p>
        <div className="secondary-content">
          <div
            className={debt.isOwner ? "button__icon" : "hide"}
            onClick={() => {
              document.getElementById("debtEdit" + debt.id).click();
            }}
          >
            <Icon>mode_edit</Icon>
          </div>
          <div className="button__icon">
            <Icon>delete</Icon>
          </div>
          <div className="button__icon">
            <Icon>check</Icon>
          </div>
          <div
            className="button__icon"
            onClick={() => {
              document.getElementById("debtMore" + debt.id).click();
            }}
          >
            <Icon>more_horiz</Icon>
          </div>
        </div>
        <Modal trigger={<div id={"debtMore" + debt.id} />}>
          <DebtBlock
            key={this.props.debt.id}
            debt={this.props.debt}
            friends={this.props.friends}
            changes={this.props.changes}
            debtChangesNewDebt={this.props.debtChangesNewDebt}
            debtChangesStartLoad={this.props.debtChangesStartLoad}
          />
        </Modal>
        <Modal trigger={<div id={"debtEdit" + debt.id} />}>
          <DebtBlock
            debt={Object.assign({}, debt)}
            friends={this.props.friends}
            hasMore={this.props.hasMore}
            editable
            handleCloseModal={() => this.closeModal()}
          />
        </Modal>
      </CollectionItem>
    );
  }

  renderRegular() {
    let { debt } = this.state;
    if (!debt) return null;
    var date = new Date(debt.created);
    var dateOfOverdue = debt.dateOfOverdue
      ? new Date(debt.dateOfOverdue)
      : new Date();
    return (
      <div className={debt.isClosed ? "card__item closed" : "card__item"}>
        <Card
          className="hoverable"
          header={
            <CardTitle
              onClick={() => {
                if (debt.isOwner) this.openModal();
              }}
              image={require("../../images/TitleImage.png")}
              waves="light"
            >
              <div className="debt__icons">
                <div className="debt__icon">
                  <span className="debt__icon__day">{date.getDate()}</span>
                  <span className="debt__icon__month">
                    {date.toLocaleString("en-us", { month: "short" })}
                  </span>
                </div>
                <div
                  className={
                    debt.dateOfOverdue
                      ? new Date(debt.dateOfOverdue).getTime() <=
                        new Date().getTime()
                        ? "debt__icon overdue"
                        : "debt__icon"
                      : "hide"
                  }
                >
                  <span className="debt__icon__day">
                    {dateOfOverdue.getDate()}
                  </span>
                  <span className="debt__icon__month">
                    {dateOfOverdue.toLocaleString("en-us", { month: "short" })}
                  </span>
                </div>
                <div
                  className={
                    debt.synchronize
                      ? "debt__icon"
                      : "debt__icon debt__icon--disabled"
                  }
                >
                  <Icon>import_export</Icon>
                </div>
              </div>
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
                >
                  <Icon large>arrow_back</Icon>
                </div>
                <div className="truncate card-title-info">
                  {debt.value + " BYN"}
                  <br />
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
            </CardTitle>
          }
          actions={[
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
              onClick={() => this.openModal()}
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
              document.getElementById("debtChanges" + debt.id).click();
                this.props.debtChangesNewDebt(debt.id);
                getDebtChangesAPI(debt.id, this.props.changes.count, 10);
              }}
            >
              <div>Change history</div>
            </a>
          ]}
          textClassName="no-padding"
        >
          <div
            className={
              this.state.active
                ? "card-content-inner active"
                : "card-content-inner"
            }
            onClick={() => this.setState({ active: !this.state.active })}
          >
            <div className="card-title">{debt.name}</div>
            <div className="card-text"> {debt.description}</div>
            {this.props.debt.updating && (
              <div className="card__loading">
                <div className="loader__container">
                  <img
                    className="debtContent__loading"
                    src={require("../../images/loadingIcon.svg")}
                    alt="Notifications"
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
        <ReactModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => this.closeModal()}
          style={customStyles}
          ariaHideApp={false}
          className="row"
          portalClassName=""
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={false}
        >
          <div className="col s12 m10 l6 xl4 offset-m1 offset-l3 offset-xl4">
            <DebtBlock
              debt={Object.assign({}, debt)}
              friends={this.props.friends}
              editable
              handleCloseModal={() => this.closeModal()}
            />
          </div>
        </ReactModal>
        <Modal
          header="Debt changes"
          trigger={<div id={"debtChanges" + debt.id} />}
        >
          <DebtChangesBlock
            debtChanges={this.props.changes}
            hasMore={this.props.hasMore}
            debtChangesStartLoad={this.props.debtChangesStartLoad}
            debtId={debt.id}
            changesLoading={this.props.changesLoading}
          />
        </Modal>
      </div>
    );
  }

  renderEditable() {
    let { debt } = this.state;
    var date = debt ? new Date(debt.created) : new Date();
    return (
      <div className="card__item">
        <Card
          header={
            <CardTitle image={require("../../images/TitleImage.png")}>
              <div
                className={
                  debt.isOwnerDebter
                    ? "card-title-inner red lighten-1"
                    : "card-title-inner green lighten-1"
                }
              >
                <div
                  onClick={() =>
                    this.setState({
                      debt: { ...debt, isOwnerDebter: !debt.isOwnerDebter }
                    })
                  }
                  className={
                    debt.isOwnerDebter
                      ? "card__arrow card__arrow--up"
                      : "card__arrow card__arrow--down"
                  }
                >
                  <Icon large>arrow_back</Icon>
                </div>
                <div className="truncate card-title-info">
                  <div className="debtBlock__value">
                    <ContentEditable
                      html={debt.value.toString()}
                      onChange={e => this.onInputChange(e, "value")}
                    />
                    <div> BYN</div>
                  </div>
                  <div onClick={() => this.setState({ friendPopupOpen: true })}>
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
          actions={[
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
                      if (this.props.new) this.addDebt();
                      else this.updateDebt();
                      this.props.handleCloseModal();
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
                      this.props.handleCloseModal();
                    }
                  });
                else this.props.handleCloseModal();
              }}
            >
              Cancel
            </a>
          ]}
          textClassName="no-padding"
        >
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

          <div className="card-content-inner">
            <div className="card-title grey-text text-darken-4">
              <ContentEditable
                html={debt.name}
                onChange={e => this.onInputChange(e, "name")}
                spellCheck="false"
                onPaste={e => this.handlePaste(e)}
                ref={this.nameRef}
              />
            </div>
            <ContentEditable
              html={debt.description}
              onChange={e => this.onInputChange(e, "description")}
              className="card-text"
              ref={this.descriptionRef}
              spellCheck="false"
              onPaste={e => this.handlePaste(e)}
            />
          </div>
          <div className="debt__icons">
            <div className="debt__icon">
              <span className="debt__icon__day">{date.getDate()}</span>
              <span className="debt__icon__month">
                {date.toLocaleString("en-us", { month: "short" })}
              </span>
            </div>

            <div className="debt__icon">
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
                debt.synchronize
                  ? "debt__icon"
                  : "debt__icon debt__icon--disabled"
              }
              onClick={() => {
                this.setState({
                  debt: { ...debt, synchronize: !debt.synchronize }
                });
              }}
            >
              <Icon>import_export</Icon>
            </div>
          </div>

          {/* </Col> */}
        </Card>
      </div>
    );
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
    removeDebtAPI(debtId, this.props.debt.friend.id);
  }

  addDebt() {
    addDebtAPI(this.state.debt);
  }

  updateDebt() {
    let { debt } = this.state;
    updateDebtAPI(
      debt.name,
      debt.friend.id,
      debt.description,
      debt.synchronize,
      debt.value,
      debt.id,
      debt.isOwnerDebter,
      convertLocalDateToUTCDate(debt.dateOfOverdue),
      debt.isClosed,
      debt.rowVersion,
      debt.friend.friendUser ? debt.friend.friendUser.username : ""
    );
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
    changes: state.debtsApp.changes,
    changesLoading: state.debtsApp.changesLoading,
    debtLoadingId: state.debtsApp.debtLoadingId,
    hasMore: state.debtsApp.hasMore,
    stateDebts: state.debtsApp.debts
  };
};

const mapDispatchToProps = dispatch => ({
  clearError: () => dispatch(debtsError("")),
  viewed: id => dispatch(debtsViewed(id)),
  debtChangesStartLoad: () => dispatch(debtChangesStartLoad()),
  debtChangesNewDebt: id => dispatch(debtChangesNewDebt(id))
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DebtBlock)
);
