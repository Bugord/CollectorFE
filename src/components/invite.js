import React from 'react'

export const Invite = ({ id, invite, onInviteApprove, onInviteDeny }) => (
  <li key={id} className="friendBlock">
    <div className="friendNameBlock"> {invite.username}></div>
    <button className="friendRemoveButton" type="button" value={id} onClick={(e) => { onInviteDeny(e.target.value) }}>✕</button>
    <button className="friendRemoveButton" type="button" value={id} onClick={(e) => { onInviteApprove(e.target.value) }}>V</button>
  </li>
)