import React from 'react'

export const Friend = ({ id, friend, onClickDelete, onClickInvite, editable }) => (
  <li key={id} className="friendBlock">
    <img className="friendIcon" src={require('../images/friendIcon.png')} alt="Notifications" />
    <div className="friendInfo">{friend.name} {friend.isSynchronized ? <span>({friend.firstName} {friend.lastName})</span> : null} <br /> {friend.email}</div>

    {editable ?
      <div>
        {!friend.isSynchronized ? <img className="friendIcon buttonIcon" src={require('../images/synchronizeIcon.png')} alt="synchronize" onClick={(e) => { onClickInvite(id)}}/> : null}
        <img className="friendIcon buttonIcon" src={require('../images/deleteIcon.png')} alt="delete" onClick={(e) => onClickDelete(id)} />
      </div> :
      <div className="friendDebt friendDebtMoreZero" >+256 BYR</div>
    }
  </li>
)