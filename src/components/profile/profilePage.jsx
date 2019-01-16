import React, { Component } from "react";
import AuthService from "../auth/authService";
import { connect } from "react-redux";
import ChangeProfileDropdown from "./changeProfileDropdown";
import DropzoneComponent from "react-dropzone-component";
import Conf from "../../configuration";
import Axios from "axios";
import { Card, Row, Button } from "react-materialize";
import Download from "../debt/exportComponent";
import { getAllFriendsAPI } from "../friends/friendsService";
import { getAllDebtsAPI } from "../debt/debtService";
import Collapsible from "react-materialize/lib/Collapsible";
import CollapsibleItem from "react-materialize/lib/CollapsibleItem";
import PropTypes from "prop-types";
import { compose } from "redux";

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
      }
    };
    getAllDebtsAPI();
    getAllFriendsAPI();
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
      <div className="row z-depth-1 grey lighten-4 center-align layout">
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
              <CollapsibleItem header="Change password" icon="lock_outline" className="no-padding-on-small">
                <ChangeProfileDropdown changePassword={true} />
              </CollapsibleItem>
            </Collapsible>
          </Card>
        </div>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  user: PropTypes.object,
  debts: PropTypes.array,
};

const mapStateToProps = state => {
  return {
    user: state.userApp.user,
    debts: state.debtsApp.debts
  };
};

export default compose(connect(mapStateToProps)(ProfilePage));
