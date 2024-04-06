import { Server } from "http";
import app from "./app";
import config from "./config/config";

const PORT = config.port;

let server: Server;

async function main() {
  try {
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error: any) {
    console.log(error.message);
  }
}

main();

//! Handle unhandledRejection
process.on("unhandledRejection", (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//! Handle uncaughtException
process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
