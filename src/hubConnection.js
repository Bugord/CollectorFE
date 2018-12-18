import Conf from "./configuration";

const signalR = require("@aspnet/signalr");

export const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl(Conf.domain + "chat", {
    accessTokenFactory: () => localStorage.getItem("token")
  })
  .build();