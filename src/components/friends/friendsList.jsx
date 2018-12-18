import React from "react";
import Friend from "./friend";

export const FriendsList = ({
  friends,
  onClickDelete,
  onClickInvite,
  editable,
  filter,
  clickable,
  onClick,
  hideSync,
  debts
}) => (
  <ul className="collection">
    {friends.map(friend => {
      if (debts) {
        var debtValue = 0;
        debts.filter(debt => debt.friendId === friend.id).forEach(element => {
          debtValue +=
            element.value * (element.isOwner === element.isOwnerDebter ? -1 : 1);
        });
      }
      if (
        (filter === undefined || friend.name.includes(filter)) &&
        (!hideSync || !friend.isSynchronized)
      )
        return (
          <Friend
            key={friend.id}
            id={friend.id}
            friend={friend}
            onClickDelete={onClickDelete}
            onClickInvite={onClickInvite}
            editable={editable}
            clickable={clickable}
            onClick={onClick}
            debtValue={debtValue}
          />
        );
      else return null;
    })}
  </ul>
);
