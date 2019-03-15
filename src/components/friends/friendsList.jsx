import React from "react";
import Friend from "./friend";
import PropTypes from "prop-types";
import { Collection } from "react-materialize";
import CollectionItem from "react-materialize/lib/CollectionItem";

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
  <Collection className="friendList">
    {friends.length !== 0 ? (
      friends.map((friend, index) => {
        if (debts) {
          var debtValue = 0;
          debts
            .filter(debt => debt.friendId === friend.id)
            .forEach(element => {
              debtValue +=
                element.value *
                (element.isOwner === element.isOwnerDebter ? -1 : 1);
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
        else return <div key={index} />;
      })
    ) : (
      <CollectionItem>You dont have any friends</CollectionItem>
    )}
  </Collection>
);

FriendsList.propTypes = {
  friends: PropTypes.array,
  editable: PropTypes.bool,
  filter: PropTypes.string,
  clickable: PropTypes.bool,
  hideSync: PropTypes.bool,
  debts: PropTypes.array,

  onClickDelete: PropTypes.func,
  onClickInvite: PropTypes.func,
  onClick: PropTypes.func
};
