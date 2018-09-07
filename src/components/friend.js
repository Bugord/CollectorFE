import React from 'react'

export const Friend = ({ id, friend, onClickDelete, onClickInvite }) => (
  <li key={id} className="friendBlock">
    <div className="friendNameBlock" style = {{width: !friend.isSynchronized ? "60%" : "80%"}}> {friend.name} {friend.isSynchronized ?
      <div className="friendNameUserInfo">{friend.firstName} {friend.lastName} ({friend.email})</div> : " "} 
    </div>
    <button className="friendRemoveButton" type="button" value={id} onClick={(e) => { onClickDelete(e.target.value) }}>✕</button>
    {!friend.isSynchronized ? <button className="friendRemoveButton" type="button" value={id} onClick={(e) => { onClickInvite(e.target.value) }}>V</button> : ""}
    
  </li>
)