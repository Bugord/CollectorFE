import React, { Component, Fragment } from "react";
import {
  CollectionItem,
  Icon,
  Chip,
  ProgressBar,
  Button,
  Modal
} from "react-materialize";
import Conf from "../../configuration";
import cx from "classnames";
import moment from "moment";
import ReactModal from "react-modal";
import { NewDebtBlock } from "./addDebtBlock";
import { PayBlock } from "./payBlock";

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

export class DebtInline extends Component {
  constructor(props) {
    super(props);

    this.payBlockRef = React.createRef();

    this.state = {
      friend: this.props.friends.find(
        friend => friend.id === props.debt.friendId
      ),
      loading: !props.friends.length,
      modalIsOpen: false,
      valueToPay: "0",
      payModalIsOpen: true
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: !nextProps.friends.length,
      friend: nextProps.friends.find(
        friend => friend.id === nextProps.debt.friendId
      )
    });
  }

  openModal() {
    if (!this.props.editable) this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  onInputChange(event) {
    const value = event.target.value;
    let type = event.target.name;
    var newState = { ...this.state.debt };
    newState[type] = value;
    this.setState(newState);
  }

  render() {
    let { debt, currencies } = this.props;
    let currency = currencies.find(currency => currency.id === debt.currencyId);
    // if (!this.state.loading) {
    //   console.log(this.state.loading);
    //   console.log(this.state.friend);
    // } else console.log(this.state.loading);
    return (
      <Fragment>
        <CollectionItem
          className={cx("avatar", "debt-inline", debt.isClosed ? "closed" : "")}
        >
          <div
            className="debtInline__trigger"
            onClick={e => {
              this.openModal();
            }}
          />
          <img
            className="circle friend__icon z-depth-1"
            alt={"friendAvatar"}
            src={
              this.state.friend && this.state.friend.friendUser
                ? Conf.domain + this.state.friend.friendUser.avatarUrl
                : Conf.domain + "images/defaultAvatar.png"
            }
          />
          <div
            className={
              debt.isOwnerDebter === debt.isOwner ? "title debter" : "title"
            }
          >
            <Icon>{debt.isMoney ? "payment" : "business_center"}</Icon>
            {debt.isMoney ? (
              <span className="debt__value">
                <Fragment>
                  {currency ? currency.currencySymbol : ""}
                  {" " +
                    debt.currentValue.toFixed(2) +
                    " (" +
                    debt.pendingValue.toFixed(2) +
                    ")/" +
                    debt.value.toFixed(2)}
                  <ProgressBar
                    progress={
                      ((debt.currentValue + debt.pendingValue) / debt.value) *
                      100
                    }
                  />
                </Fragment>
              </span>
            ) : (
              <span className="debt__name"> {debt.name}</span>
            )}
          </div>
          <div className="debt__friend-name">
            {this.state.friend ? this.state.friend.name : ""}
          </div>

          <div className="debt__description">{debt.description}</div>

          {debt.dateOfOverdue ? (
            <Chip className="debt__overdue-date">
              <Icon tiny>alarm_off</Icon>
              <span>{moment(debt.dateOfOverdue).format("DD MMM YYYY")}</span>
            </Chip>
          ) : null}

          {debt.isOwner && (
            <div className="debt__icon-isOwner" title="Debt owner">
              <Icon green>assignment_ind</Icon>
            </div>
          )}
          {!debt.isClosed && (
            <Modal
              id={"modal" + debt.id}
              className="debtPay__modal"
              trigger={
                <Button
                  floating
                  className="debt__pay-button green lighten-2"
                  type="button"
                >
                  Pay
                </Button>
              }
              modalOptions={{
                complete: () => {
                  this.payBlockRef.current.modalClosed();
                }
              }}
            >
              <PayBlock
                ref={this.payBlockRef}
                maxValue={
                  this.props.debt.value -
                  (this.props.debt.currentValue + this.props.debt.pendingValue)
                }
                debtId={debt.id}
                isMoney={debt.isMoney}
                debtCurrency={this.props.currencies.find(
                  currency => currency.id === debt.currencyId
                )}
                currencies={this.props.currencies}
                closeModal={() => {
                  document
                    .getElementById("modal" + debt.id)
                    .getElementsByClassName("modal-close")[0]
                    .click();
                }}
              />
            </Modal>
          )}
          {/* <div className="debt__created-date">
          {"created " + moment(debt.created).format("DD MMM YYYY")}
        </div> */}
        </CollectionItem>
        <ReactModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => this.closeModal()}
          style={customStyles}
          ariaHideApp={false}
          className="col s12 m10 l6 xl4 offset-m1 offset-l3 offset-xl4"
          overlayClassName="row"
        >
          {/* <div className="col s12 m10 l6 xl4 offset-m1 offset-l3 offset-xl4"> */}
          {/* <DebtBlock
            debt={Object.assign({}, debt)}
            openModalDebtChanges={this.props.openModalDebtChanges}
            friends={this.props.friends}
            // editable={debt.isOwner && !debt.isClosed}
            zoomed
            handleCloseModal={() => this.closeModal()}
          /> */}

          <NewDebtBlock
            closeModal={() => this.closeModal()}
            debt={Object.assign({}, debt)}
            friend={this.state.friend}
            currencies={this.props.currencies}
          />

          {/* </div> */}
        </ReactModal>
      </Fragment>
    );
  }
}
