import Popup from "./popup";

export default class ChangeIconPopup extends Popup {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="popup popup__changeProfileInfo z-depth-2" ref={this.setWrapperRef}>
        <div
          type="button"
          className="popup__closeButton"
          onClick={this.props.togglePopup}
        >
          ✕
        </div>
        {this.props.changePassword
          ? this.renderChangePassword()
          : this.renderChangeInfo()}
      </div>
    );
  }
}
