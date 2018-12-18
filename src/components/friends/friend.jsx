import React, { Component } from "react";
import FriendsService from "./friendsService";
import Icon from "react-materialize/lib/Icon";
import Input from "react-materialize/lib/Input";
import swal from "sweetalert";
import Conf from "../../configuration";

class Friend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEmailField: false,
      showNameField: false,
      valid: false,
      errorMessage: "",
      email: "",
      emailError: "",
      name: "",
      nameError: ""
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.classNames = "friendBlock collection-item";
    if (this.props.clickable) this.classNames += " friendBlock--hoverable";
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        showEmailField: false,
        showNameField: false,
        valid: false,
        errorMessage: "",
        email: "",
        emailError: "",
        name: "",
        nameError: ""
      });
    }
  }

  onInputChange(event, type) {
    const value = event.target.value;
    const name = event.target.name;
    var newState = {};
    newState[type] = value;
    this.setState(newState, () => this.validate(name));
  }

  validate(name) {
    var valid = true;

    this.setState({ errorMessage: "", errorEmail: "" });

    if (this.state.name.length < 3 || this.state.name.length > 16) {
      if (name === "name")
        this.setState({ errorMessage: "Name must be between 3 an 16" });
      valid = false;
    } else this.setState({ errorMessage: "" });

    if (this.state.name.length < 3 || this.state.name.length > 16) {
      if (name === "name")
        this.setState({ errorEmail: "Name must be between 3 an 16" });
      valid = false;
    } else this.setState({ errorEmail: "" });

    this.setState({ valid: valid });
  }

  render() {
    var { friend } = this.props;
    return (
      <li
        className={
          this.props.clickable
            ? "collection-item avatar hoverable"
            : "collection-item avatar"
        }
        onClick={() => {
          if (this.props.clickable) this.props.onClick(friend);
        }}
      >
        <img
          src={friend.friendUser ? Conf.domain + friend.friendUser.avatarUrl : Conf.domain + "images/defaultAvatar.png"}
          alt="FriendIcon"
          className="circle"
        />
        <span className="title">
          {friend.name}
          {friend.friendUser ? "(" + friend.friendUser.username + ")" : ""}
        </span>
        {friend.friendUser ? (
          <p>
            {friend.friendUser.firstName} {friend.friendUser.lastName}
            <br />
            {friend.friendUser.email}
          </p>
        ) : (
          ""
        )}

        <div className={this.props.editable ? "secondary-content" : "hide"}>
          <div
            className={
              this.state.showEmailField ? "hide-on-small-only" : "hide"
            }
          >
            <Input
              label="Email"
              type="email"
              name="email"
              ref="emailInput"
              placeholder="Enter email"
              value={this.state.email}
              valid={(!this.state.emailError).toString()}
              error={this.state.emailError}
              onChange={e => this.onInputChange(e, "email")}
              required
              minLength={3}
              validate={true}
              s={11}
            />
          </div>
          <div
            className={this.state.showNameField ? "hide-on-small-only" : "hide"}
          >
            <Input
              label="New name"
              type="text"
              name="name"
              placeholder="Enter new name"
              value={this.state.name}
              valid={(!this.state.nameError).toString()}
              error={this.state.nameError}
              onChange={e => this.onInputChange(e, "name")}
              required
              minLength={3}
              validate={true}
              s={11}
            />
          </div>
          <div
            className={friend.isSynchronized ? "hide" : "button__icon hide-on-small-only"}
            onClick={e => {
              if (this.state.email && this.state.showEmailField) {
                this.props.onClickInvite(friend.id, this.state.email);
                this.setState({ showEmailField: false });
              } else {
                this.setState({ showEmailField: true, showNameField: false });
              }
            }}
          >
            <Icon>swap_calls</Icon>
          </div>
          <div
            className="button__icon hide-on-small-only"
            onClick={() => {
              if (!this.state.showNameField) {
                this.setState({
                  showNameField: true,
                  showEmailField: false,
                  name: this.props.friend.name
                });
              } else {
                FriendsService.updateFriend(
                  this.state.name,
                  this.props.friend.id
                );
                this.setState({ showNameField: false });
              }
            }}
          >
            <Icon>edit</Icon>
          </div>
          <div
            className="button__icon"
            onClick={e => {
              swal({
                title: "Are you sure?",
                text:
                  "You will delete your friend and all debts connected with it",
                icon: "warning",
                buttons: true,
                dangerMode: true
              }).then(willDelete => {
                if (willDelete) {
                  this.props.onClickDelete(friend.id);
                }
              });
              // if (window.confirm("Delete this friend?"))
              //   this.props.onClickDelete(friend.id);
            }}
          >
            <Icon>remove_circle</Icon>
          </div>
        </div>
      </li>
    );
  }

//   render2() {
//     var { friend } = this.props;
//     var { onClick } = this.props;
//     return (
//       <li
//         className={this.classNames}
//         ref={this.setWrapperRef}
//         onClick={() => {
//           if (this.props.clickable) onClick(friend);
//         }}
//       >
//         <img
//           className="friend__icon"
//           src={require("../images/friendIcon.png")}
//           alt="FriendIcon"
//         />
//         <div className="friend__info">
//           {this.state.showNameField ? (
//             <div>
//               <input
//                 type="text"
//                 name="name"
//                 className="input"
//                 ref="nameInput"
//                 value={this.state.name}
//                 onChange={e => this.onInputChange(e, "name")}
//               />
//             </div>
//           ) : (
//             friend.name
//           )}
//           {friend.isSynchronized ? (
//             <span>({friend.friendUser.username})</span>
//           ) : null}
//           <br /> {friend.friendUser ? friend.friendUser.email : ""}
//         </div>
//         {this.renderEmailField()}
//         {this.props.editable ? (
//           this.renderEditable()
//         ) : !this.props.clickable ? (
//           <div
//             className={
//               this.props.debtValue >= 0
//                 ? "friendDebt friendDebt--green"
//                 : "friendDebt friendDebt--red"
//             }
//           >
//             {Math.abs(this.props.debtValue) + " BYN"}
//           </div>
//         ) : null}
//       </li>
//     );
//   }

//   renderEditable() {
//     var { friend } = this.props;
//     return (
//       <div>
//         {!friend.isSynchronized ? (
//           <img
//             className="friend__icon button__icon"
//             src={require("../images/synchronizeIcon.png")}
//             alt="synchronize"
//             onClick={e => {
//               if (this.refs.emailInput.value && this.state.showEmailField) {
//                 this.props.onClickInvite(friend.id, this.refs.emailInput.value);
//                 this.setState({ showEmailField: false });
//               } else {
//                 this.setState(
//                   { showEmailField: true, showNameField: false },
//                   () => {
//                     this.refs.emailInput.focus();
//                   }
//                 );
//               }
//             }}
//           />
//         ) : null}
//         <div
//           className="friend__icon button__icon"
//           onClick={() => {
//             if (!this.state.showNameField) {
//               this.setState({
//                 showNameField: true,
//                 showEmailField: false,
//                 name: this.props.friend.name
//               });
//             } else {
//               FriendsService.updateFriend(
//                 this.state.name,
//                 this.props.friend.id
//               );
//               this.setState({ showNameField: false });
//             }
//           }}
//         >
//           <Icon>edit</Icon>
//         </div>
//         <div
//           className="friend__icon button__icon"
//           onClick={e => {
//             if (window.confirm("Delete this friend?"))
//               this.props.onClickDelete(friend.id);
//           }}
//         >
//           <Icon>remove_circle</Icon>
//         </div>
//       </div>
//     );
//   }

//   renderEmailField() {
//     return (
//       <div
//         className={this.state.showEmailField ? "friend__emailInvite" : "hidden"}
//       >
//         <input
//           className="input"
//           ref="emailInput"
//           placeholder="email or login"
//           type="text"
//           maxLength={100}
//           minLength={3}
//         />
//       </div>
//     );
//   }
}

export default Friend;
