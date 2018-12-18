import React from "react";

export const Notification = ({ invite, acceptInvite, denyInvite }) => (
  <li className="popupList popup__notification">
    <div className="invite__text">
      {invite.username}({invite.email}) invited you to synchronize your debts
    </div>
    <button
      type="button"
      onClick={() => denyInvite(invite.id)}
      className="button button--small invite__button"
    >
      Deny
    </button>
    <button
      type="button"
      className="button button--green button--small invite__button"
      onClick={() => {
        acceptInvite(invite.id);
      }}
    >
      Accept
    </button>
    <br />
    <br />
    <br />
    <hr />
  </li>
);
