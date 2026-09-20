import * as signalR from "@microsoft/signalr";

const HUB_URL = "https://localhost:7281/hubs/orders";

let connection = null;

export const startSignalRConnection = async (onOrderStatusChanged) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No authentication token found.");
    return;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => localStorage.getItem("token"),
    })
    .withAutomaticReconnect()
    .build();

  connection.on("OrderStatusChanged", (data) => {
    console.log("Order status changed:", data);

    if (onOrderStatusChanged) {
      onOrderStatusChanged(data);
    }
  });

  try {
    await connection.start();
    console.log("SignalR connected.");
  } catch (error) {
    console.error("SignalR connection failed:", error);
  }
};

export const stopSignalRConnection = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
    console.log("SignalR disconnected.");
  }
};