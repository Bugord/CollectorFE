import React from 'react'
import { Invite } from './invite';

export const InvitesList = ({ invites, onInviteApprove, onInviteDeny }) => (
  <ul className="friendListBlock">
    {invites.map(invite =>
      <Invite
        key={invite.id}
        id={invite.id}        
        invite={invite}
        onInviteApprove={onInviteApprove}
        onInviteDeny={onInviteDeny}
      />
    )}
  </ul>
)