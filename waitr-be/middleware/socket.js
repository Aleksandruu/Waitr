// const socketIo = require("socket.io");

// let io;

// function initSocket(server) {
//   io = socketIo(server, {
//     cors: { origin: "*" },
//   });

//   io.on("connection", (socket) => {
//     console.log("Un ospătar s-a conectat!");

//     socket.on("disconnect", () => {
//       console.log("Un ospătar s-a deconectat!");
//     });
//   });
// }

// function getIo() {
//   if (!io) {
//     throw new Error("Socket.io nu a fost inițializat!");
//   }
//   return io;
// }

// module.exports = { initSocket, getIo };
