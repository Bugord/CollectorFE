import React from 'react'

export const Friend = ({ id, friend, onClickDelete, onClickInvite, editable }) => (
  <li key={id} className="friendBlock">
    <img className="friend__icon" src={require('../images/friendIcon.png')} alt="Notifications" />
    <div className="friend__info">{friend.name} {friend.isSynchronized ? <span>({friend.firstName} {friend.lastName})</span> : null} <br /> {friend.email}</div>

    {editable ?
      <div>
        {!friend.isSynchronized ? <img className="friend__icon button__icon" src={require('../images/synchronizeIcon.png')} alt="synchronize" onClick={(e) => { onClickInvite(id)}}/> : null}
        <img className="friend__icon button__icon" src={require('../images/deleteIcon.png')} alt="delete" onClick={(e) => onClickDelete(id)} />
      </div> :
      <div className="friendDebt frienDebt--green" >+256 BYR</div>
    }
  </li>
)