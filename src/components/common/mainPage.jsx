import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../auth/authService";
import { FriendsList } from "../friends/friendsList";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getAllFriendsAPI } from "../friends/friendsService";
import DebtBlock from "../debt/debtBlock";
import { getAllDebtsAPI, getDebtChangesAPI } from "../debt/debtService";
import ChatBlock from "../chat/chatBlock";
import Button from "react-materialize/lib/Button";
import ReactModal from "react-modal";
import { Row, Col, Modal, Collection, Collapsible } from "react-materialize";
import DebtSearch from "../debt/debtSearch";
import ScrollUpButton from "react-scroll-up-button";
import { compose } from "redux";
import DebtChangesBlock from "../debt/debtChangesBlock";
import { debtChangesStartLoad, debtChangesNewDebt } from "../debt/debtsActions";
import { dynamicSort } from "./helperFunctions";
import { NewDebtBlock } from "../debt/addDebtBlock";
import { DebtInline } from "../debt/debtInline";
import FilterBlock from "../filterBlock/filterBlock";
import CollapsibleItem from "react-materialize/lib/CollapsibleItem";

const customStyles = {
  content: {
    top: "20%",
    position: "fixed"
  }
};

class MainPage extends Component {
  constructor(props) {
    super(props);
    if (!AuthService.loggedIn()) {
      props.history.push("/login");
    } else {
      getAllFriendsAPI();
      getAllDebtsAPI();
    }

    this.searchBlock = React.createRef();

    this.state = {
      debts: this.props.debts,
      modalIsOpen: false,
      gridView: false,
      changesDebtId: 0,
      sortFilter: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ debts: nextProps.debts }, () => this.sortDebts());
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  openModalDebtChanges(debtId) {
    this.setState({ changesDebtId: debtId }, () => {
      this.props.debtChangesNewDebt(debtId);
      getDebtChangesAPI(debtId, 0, 10);
      document.getElementById("debtChangesTrigger").click();
    });
  }

  sortDebts() {
    let debts = this.state.debts.slice();
    switch (this.state.sortFilter) {
      case "createDateDesc":
        debts.sort(dynamicSort("created"));
        break;
      default:
      case "createDateAsc":
        debts.sort(dynamicSort("-created"));
        break;
      case "valueDesc":
        debts.sort(dynamicSort("value"));
        break;
      case "valueAsc":
        debts.sort(dynamicSort("-value"));
        break;
    }
    this.setState({ debts: debts });
  }

  render() {
    let { friends, debts } = this.props;
    return (
      <div className="mainPage">
        <ScrollUpButton
          StopPosition={0}
          ShowAtPosition={150}
          EasingType="easeOutCubic"
          AnimationDuration={500}
          ContainerClassName="ScrollUpButton__Container"
          TransitionClassName="ScrollUpButton__Toggled"
          style={{
            zIndex: "25",
            right: "inherit",
            left: "20px",
            borderRadius: "10px"
          }}
        />
        {AuthService.loggedIn() ? null : <Redirect to="/login" />}
        <div className="row">
          {!this.props.debtsLoading || this.props.updated ? (
            <div className="col s12 l8 xl9 no-padding-on-small">
              <Row>
                <Col className="no-padding-on-small" s={12}>
                  <div className="debt__searchBox row z-depth-1 grey lighten-4">
                    <div className="col s12 l9">
                      <FilterBlock
                        debts={this.props.debts}
                        friends={this.props.friends}
                      />
                      {/* <DebtSearch
                        debtsCount={debts.length}
                        ref={this.searchBlock}
                        friends={friends}
                        onSortFilterChange={filter => {
                          this.setState({ sortFilter: filter }, () =>
                            this.sortDebts()
                          );
                        }}
                      /> */}
                    </div>

                    {/* <Col s={12} l={4} xl={3}>
                      <Row>
                        <Button
                          onClick={() => this.openModal()}
                          className="col s12 waves-effect waves-green green lighten-2"
                        >
                          Add new debt
                        </Button>
                      </Row>
                    </Col> */}
                  </div>
                </Col>
              </Row>
              <Row>
                <div className="col xl3 l4 s12 hide-on-large-only no-padding-on-small">
                  {this.props.friends.length || !this.props.friendsLoading ? (
                    <div className="debt__searchBox row z-depth-1 grey lighten-4">
                      <div className="col s12">
                        <h5>Friend list:</h5>
                        <div>
                          <Collapsible>
                            <CollapsibleItem
                              className="no-padding-on-small"
                              header="Friends"
                              icon="supervisor_account"
                            >
                              <FriendsList
                                friends={friends}
                                editable={false}
                                debts={debts}
                              />
                            </CollapsibleItem>
                          </Collapsible>
                          <br />
                          <Link to="/friends" className="button button--green">
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Row>
              <Row>
                <div className=" col s12 no-padding-on-small">
                  <div
                    className={
                      this.state.gridView
                        ? "debt__layout"
                        : "collection grey lighten-4"
                    }
                  >
                    {this.state.gridView ? (
                      this.state.debts.map(debt => (
                        <DebtBlock
                          key={debt.id}
                          debt={debt}
                          friends={friends}
                          asCollectionItem={!this.state.gridView}
                          openModalDebtChanges={debtId =>
                            this.openModalDebtChanges(debtId)
                          }
                        />
                      ))
                    ) : (
                      <div>
                        <Row>
                          <Col s={12}>
                            <h5>Debts:</h5>
                            <div className="debt-inline__block">
                              <div className="debt-inline__addButton">
                                <Button
                                  title="Add new debt"
                                  waves="light"
                                  large
                                  icon="add"
                                  floating
                                  className="green lighten-2"
                                  onClick={() => this.openModal()}
                                />
                              </div>
                              {this.state.debts.map(debt => (
                                <DebtInline
                                  key={debt.id}
                                  debt={debt}
                                  currencies={this.props.currencies}
                                  friends={friends}
                                  openModalDebtChanges={debtId =>
                                    this.openModalDebtChanges(debtId)
                                  }
                                />
                              ))}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>
                </div>
                {this.props.hasMoreDebts ? (
                  <Row className="center-align">
                    <Button
                      className="green lighten-2"
                      onClick={() =>
                        this.searchBlock.current.updateDebts(false)
                      }
                    >
                      Load more
                    </Button>
                  </Row>
                ) : null}
              </Row>
              <ReactModal
                isOpen={this.state.modalIsOpen}
                onRequestClose={() => this.closeModal()}
                style={customStyles}
                ariaHideApp={false}
                className="col s12 m10 l6 xl4 offset-m1 offset-l3 offset-xl4"
                portalClassName="row"
              >
                <NewDebtBlock
                  closeModal={() => this.closeModal()}
                  currencies={this.props.currencies}
                />
                {/* <DebtBlock
                  new
                  editable
                  friends={friends}
                  handleCloseModal={() => this.closeModal()}
                /> */}
              </ReactModal>
              <Modal
                header="Debt changes"
                trigger={<div id={"debtChangesTrigger"} />}
              >
                <DebtChangesBlock
                  debtChanges={this.props.changes}
                  hasMore={this.props.hasMore}
                  debtChangesStartLoad={this.props.debtChangesStartLoad}
                  debtId={this.state.changesDebtId}
                  changesLoading={this.props.changesLoading}
                />
              </Modal>
            </div>
          ) : (
            <div className="debtContent debtContent__loading">
              <img
                className="debtContent__loading"
                src={require("../../images/loadingIcon.svg")}
                alt="Notifications"
              />
            </div>
          )}
          <div className="col xl3 l4 hide-on-med-and-down friends__layout">
            {this.props.friends.length || !this.props.friendsLoading ? (
              <div className="debt__searchBox row z-depth-1 grey lighten-4">
                <div className="col s12">
                  <h5>Friend list:</h5>
                  <div>
                    <FriendsList
                      friends={friends}
                      editable={false}
                      debts={debts}
                    />

                    <br />
                    <Link to="/friends" className="button button--green">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <ChatBlock />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    friends: state.friendsApp.friends,
    debts: state.debtsApp.debts,
    debtsLoading: state.debtsApp.updateLoading,
    friendsLoading: state.friendsApp.loading,
    updated: state.debtsApp.updated,
    hasMoreDebts: state.debtsApp.hasMoreDebts,
    changes: state.debtsApp.changes,
    hasMore: state.debtsApp.hasMore,
    changesLoading: state.debtsApp.changesLoading,
    currencies: state.debtsApp.currencies
  };
};
const mapDispatchToProps = dispatch => ({
  debtChangesStartLoad: () => dispatch(debtChangesStartLoad()),
  debtChangesNewDebt: debtId => dispatch(debtChangesNewDebt(debtId))
});
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainPage)
);
