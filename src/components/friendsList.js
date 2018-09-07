import React from 'react'
import {Friend} from './friend'

export const FriendsList = ({ friends, onClickDelete, onClickInvite }) => (
  <ul className="friendListBlock">
    {friends.map(friend =>
      <Friend
        key={friend.id}
        id={friend.id}        
        friend={friend}
        onClickDelete={onClickDelete}
        onClickInvite={onClickInvite}
      />
    )}
  </ul>
)