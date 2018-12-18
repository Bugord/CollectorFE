import React from "react";
import Popup from "../common/popup";
import { connect } from "react-redux";
import { FriendsList } from "../friends/friendsList";
import { Input, Row, Col } from "react-materialize";

class AcceptFriendBlock extends Popup {
  constructor(props) {
    super(props);
    this.state = { searchValue: "" };
    this.nameInput = React.createRef();
  }

  componentDidMount() {
    this.nameInput.current.input.focus();
  }

  render() {
    return (
      <div
        className="popup popup__acceptInvite z-depth-2 col"
        ref={this.setWrapperRef}
      >
        <div className="popup__name">Search friend</div>
        <div
          type="button"
          className="popup__closeButton"
          onClick={this.props.togglePopup}
        >
          ✕
        </div>
        <Row>
          <Input
            type="text"
            value={this.state.searchValue}
            onChange={e => this.onInputChange(e)}
            ref={this.nameInput}
            label="Friend"
            s={12}
          />
        </Row>
        <Row>
          <Col s={12}>
            <FriendsList
              friends={this.props.friends}
              editable={false}
              filter={this.state.searchValue}
              clickable={true}
              onClick={friend => this.existedFriend(friend)}
              hideSync={this.props.hideSync}
            />
          </Col>
        </Row>
        {this.props.canAdd ? (
          <Row>
            <button
              type="button"
              className="button button--green"
              onClick={() => this.addNewFriend(this.state.searchValue)}
            >
              Add new
            </button>
          </Row>
        ) : null}
      </div>
    );
  }

  addNewFriend(friendName) {
    if (this.props.acceptInvite) this.props.acceptInvite(friendName);
  }

  existedFriend(friend) {
    if (this.props.acceptInvite) this.props.acceptInvite(undefined, friend.id);
    if (this.props.onSelect) this.props.onSelect(friend);
  }

  onInputChange(event) {
    const value = event.target.value;
    this.setState({ searchValue: value });
  }
}

const mapStateToProps = state => {
  return {
    friends: state.friendsApp.friends
  };
};

export default (AcceptFriendBlock = connect(mapStateToProps)(
  AcceptFriendBlock
));
