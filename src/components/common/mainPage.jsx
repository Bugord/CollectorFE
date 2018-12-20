import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../auth/authService";
import { FriendsList } from "../friends/friendsList";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getAllFriendsAPI } from "../friends/friendsService";
import DebtBlock from "../debt/debtBlock";
import { getAllDebtsAPI } from "../debt/debtService";
import ChatBlock from "../chat/chatBlock";
import Button from "react-materialize/lib/Button";
import ReactModal from "react-modal";
import { Row, Col } from "react-materialize";
import DebtSearch from "../debt/debtSearch";
import Icon from "react-materialize/lib/Icon";
import ScrollUpButton from "react-scroll-up-button";
import { compose } from "redux";

const customStyles = {
  content: {
    top: "20%",
    position: "fixed"
  }
};

class MainPage extends Component {
  constructor(props) {
    super(props);
    getAllFriendsAPI();
    getAllDebtsAPI();
    AuthService.getUserInfo();

    this.searchBlock = React.createRef();

    this.state = {
      debts: this.props.debts,
      modalIsOpen: false,
      gridView: true
    };
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  openModal() {
    this.setState({ modalIsOpen: true });
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
          style={{ zIndex: "25", right: "inherit", left: "20px" }}
        />
        {AuthService.loggedIn() ? null : <Redirect to="/login" />}
        <div className="row">
          {!this.props.debtsLoading || this.props.updated ? (
            <div className="col s12 l8 xl9 no-padding-on-small">
              <Row>
                <Col className="no-padding-on-small" s={12}>
                  <div className="debt__searchBox row z-depth-1 grey lighten-4">
                    <div className="col s12 l9">
                      <DebtSearch
                        debtsCount={debts.length}
                        ref={this.searchBlock}
                        friends={friends}
                      />
                    </div>

                    <Col s={12} l={4} xl={3}>
                      <Row>
                        <Button
                          onClick={() => this.openModal()}
                          className="col s12 waves-effect waves-green green lighten-2"
                        >
                          Add new
                        </Button>
                      </Row>
                      <Row>
                        <Button
                          floating
                          large
                          className="green lighten-2"
                          waves="light"
                          onClick={() =>
                            this.setState({ gridView: !this.state.gridView })
                          }
                        >
                          <Icon>
                            {this.state.gridView
                              ? "format_list_bulleted"
                              : "apps"}
                          </Icon>
                        </Button>
                      </Row>
                    </Col>
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
              </Row>
              <Row>
                <div className=" col s12 no-padding-on-small">
                  <div
                    className={
                      this.state.gridView ? "debt__layout" : "collection"
                    }
                  >
                    {this.props.debts.map(debt => {
                      return (
                        <DebtBlock
                          key={debt.id}
                          debt={debt}
                          friends={friends}
                          asCollectionItem={!this.state.gridView}
                        />
                      );
                    })}
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
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
              >
                <DebtBlock
                  new
                  editable
                  friends={friends}
                  handleCloseModal={() => this.closeModal()}
                />
              </ReactModal>
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
    hasMoreDebts: state.debtsApp.hasMoreDebts
  };
};

export default compose(connect(mapStateToProps)(MainPage));
