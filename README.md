Basic Feature Set
=================
ChannelList:
  * show list of allowed channels, click to navigate
  * show # of new messages per channel not currently showing
  * show icon if "name," mentioned
  * button to create new channel

ChatBox
  * Show last X messages on join
  * Highlight lines that have your name in them
 
UserList
  * Show list of users allowed in channel
  * Sort online users to top
  * Show typing indicators when others are typing
  * If owner, have button to invite others to channel

Client State Tree
================
user
  handle
  token

site
  hydrated

chat
  channels : List
    id
    name
    owner
    members (handle, online, typing)
    messages (last X on join, adds as they come in)

Client/Server API
=================
REST
  * register - registers the user if possible
    request = {handle, password} (password > 8 characters)
    response = {status, reason}

  * login - returns token for socket communication
    request = {handle, password} (password > 8 characters)
    response = {status, reason, token}

Websocket
  All client communication includes a JWT-signed token that the server
  provided at login time.

  * channel_add - Adds a channel to a user.
    server->client and owner->server->client. Happens on connect and invite
    payload = {
      id,
      name,
      owner,
      members  = [{handle, online, typing}],
      messages = [{index, date, handle, content}] (last 100 on join)
    }

  * channel_user_update - Updates all members of a channel that a user's status has changed.
    client->server->channel. Happens on user add, login, or typing.
    payload = {
      id,
      member = {handle, online, typing}
    }

  * channel_message_add
    client->server->channel. Happens on user entering message into channel.
    payload = {
      id,
      message = {index, date, handle, content}
    }


Server Database Schema
======================
User
  handle
  passwordSalt
  passwordHash - generated using bcrypt
  ownedChannels = [id]
  memberChannels = [id]

Channel
  id
  name
  owner = {id, handle}
  members = [{id, handle}]
  messages = {index, date, userHandle, content}

Server In-Memory Cache
======================
userHandle -> {online, typing = channelID}
