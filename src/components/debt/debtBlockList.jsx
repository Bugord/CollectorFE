import React from 'react'
import {Friend} from './friend'
import PropTypes from "prop-types";

export const FriendsList = ({ friends, onClickDelete, onClickInvite, editable, value }) => (
  <ul className="friendListBlock">
    {friends.map(friend =>
      <Friend
        key={friend.id}
        id={friend.id}        
        friend={friend}
        onClickDelete={onClickDelete}
        onClickInvite={onClickInvite}
        editable={editable}
        value={value}
      />
    )}
  </ul>
)

FriendsList.propTypes = {
  friends: PropTypes.array,
  onClickDelete: PropTypes.func,
  onClickInvite: PropTypes.func,
  editable: PropTypes.bool,
  value: PropTypes.number,
};