import React, { Component } from "react";
import AuthService from "../authService";
import { connect } from "react-redux";
import ChangeProfileDropdown from "../changeProfileDropdown";
import DropzoneComponent from "react-dropzone-component";
import Conf from "../configuration";
import Axios from "axios";
import { Card, Row, Button } from "react-materialize";
import Download from "../exportComponent";
import FriendsService from "../friendsService";
import DebtService from "../debtService";
import Collapsible from "react-materialize/lib/Collapsible";
import CollapsibleItem from "react-materialize/lib/CollapsibleItem";

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: AuthService.getLogin(),
      showChangeProfileDropdown: false,
      showChangePasswordDropdown: false,
      selectedFile: null
    };

    this.componentConfig = { postUrl: "no-url" };
    this.djsConfig = {
      autoProcessQueue: false,
      previewTemplate: "<div></div>"
    };

    this.eventHandlers = {
      addedfile: file => {
        const url = Conf.domain + "api/changeProfile";
        const formData = new FormData();
        formData.append("AvatarFile", file);
        const config = {
          headers: {
            Authorization: "Bearer " + AuthService.getToken(),
            "content-type": "multipart/form-data"
          }
        };
        Axios.put(url, formData, config)
          .then(res => {
            AuthService.setUser(res.data);
          })
          .catch(res => {
            if (res.response !== undefined)
              this.setState({ errorMessage: res.response.data.message });
            else this.setState({ errorMessage: res.message });
          });

        // AuthService.put("api/changeProfile", "", {
        //   AvatarFile: file.upload
        // });
      }
    };
    DebtService.getAllDebts();
    FriendsService.getAllFriends();
    this.authorizedRender = this.authorizedRender.bind(this);

    // if (!this.state.login && AuthService.loggedIn()) {
    //   AuthService.getInfo(login => this.setState({ login: login }));
    // }
  }

  calculateSummary() {
    let youOwe = 0;
    let oweYou = 0;

    this.props.debts.forEach(debt => {
      if (!debt.isClosed)
        if (debt.isOwnerDebter === debt.isOwner) youOwe += debt.value;
        else oweYou += debt.value;
    });

    return { oweYou: oweYou, youOwe: youOwe };
  }

  render() {
    if (!AuthService.loggedIn()) this.props.history.push("/login");

    var summary = this.calculateSummary();
    let { user } = this.props;
    return (
      <div className="row z-depth-1 grey lighten-4 center-align">
        <h3 className="col s12">Profile Page</h3>
        <div className="col l4 m5 s12">
          <Row>
            <Card>
              <h4>{user.username}</h4>
              <DropzoneComponent
                config={this.componentConfig}
                eventHandlers={this.eventHandlers}
                djsConfig={this.djsConfig}
              >
                <img
                  className="profile__icon"
                  src={Conf.domain + user.avatarUrl}
                  alt="Profile"
                />
              </DropzoneComponent>
              <h5>
                {user.firstName} {user.lastName}
              </h5>
              <h5>{user.email}</h5>
            </Card>
          </Row>
          <Row>
            <Card className="left-align" s={12} title="Summary">
              <p>You owe: {summary.youOwe}</p>
              <p> Owe you: {summary.oweYou}</p>
            </Card>
          </Row>
          <Row>
            <Download
              button={
                <Button className="col s12 waves-effect waves-green green lighten-2">
                  Export all (xlsx)
                </Button>
              }
            />
          </Row>
        </div>
        <div className="col l8 m7 s12">
          <Card className="no-padding-on-small">
            <Row>
              <h4>Settings</h4>
            </Row>
            <Collapsible popout accordion>
              <CollapsibleItem
              className="no-padding-on-small"
                header="Change first name, last name, email"
                icon="person"
              >
                <ChangeProfileDropdown />
              </CollapsibleItem>
              <CollapsibleItem header="Change password" icon="lock_outline">
                <ChangeProfileDropdown changePassword={true} />
              </CollapsibleItem>
            </Collapsible>
          </Card>
          {/* <p
                onClick={() =>
                  this.setState({ showChangeProfileDropdown: true })
                }
              >
                Change first name, last name...
              </p>
              {this.state.showChangeProfileDropdown ? (
                <ChangeProfileDropdown
                  togglePopup={() => this.toggleProfilePopup()}
                />
              ) : null}
              <p
                onClick={() =>
                  this.setState({ showChangePasswordDropdown: true })
                }
              >
                Change password...
              </p>
              {this.state.showChangePasswordDropdown ? (
                <ChangeProfileDropdown
                  changePassword={true}
                  togglePopup={() =>
                    this.setState({ showChangePasswordDropdown: false })
                  }
                />
              ) : null} */}
        </div>
      </div>
    );
  }

  fileChangedHandler(event) {
    this.setState({ selectedFile: event.target.files[0] });
  }

  authorizedRender() {
    let { user } = this.props;
    return (
      <div className="profile__content">
        <img
          className="profile__icon"
          src={Conf.domain + user.avatarUrl}
          alt="Profile"
        />
        <DropzoneComponent
          config={this.componentConfig}
          eventHandlers={this.eventHandlers}
          djsConfig={this.djsConfig}
        />
        {/* <input type="file" onChange={e => this.fileChangedHandler(e)} />
        <button onClick={() => AuthService.uploadFile(this.state.selectedFile)}>
          Upload!
        </button> */}
        <h1>{user.username}</h1>
        <h3>
          {user.firstName} {user.lastName}
        </h3>
        <h4>{user.email}</h4>
        <div style={{ clear: "both" }} />
        <br />
        <br />
        <br />
        <span
          className="form__link"
          onMouseDown={() => this.toggleProfilePopup()}
        >
          Change profile info
        </span>
        {this.state.showChangeProfileDropdownDropdown ? (
          <ChangeProfileDropdown
            togglePopup={() => this.toggleProfilePopup()}
          />
        ) : null}
        <br />
        <br />
        <span
          className="form__link"
          onMouseDown={() => this.togglePasswordPopup()}
        >
          Change password
        </span>
        {this.state.showChangePasswordDropdown ? (
          <ChangeProfileDropdown
            changePassword={true}
            togglePopup={() => this.togglePasswordPopup()}
          />
        ) : null}
      </div>
    );
  }

  togglePasswordPopup() {
    this.setState({
      showChangePasswordDropdown: !this.state.showChangePasswordDropdown
    });
  }

  toggleProfilePopup() {
    this.setState({
      showChangeProfileDropdown: false
    });
  }
}

const mapStateToProps = state => {
  return {
    user: state.userApp.user,
    debts: state.debtsApp.debts
  };
};

export default (ProfilePage = connect(mapStateToProps)(ProfilePage));
