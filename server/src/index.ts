import { Hono } from "hono";
import { upgradeWebSocket } from "hono/cloudflare-workers";
export { WebhookReceiver } from "./receiver";

// NOTE: In Cloudflare Workers, global variables do not persist between requests.
// This example is for prototyping on a single instance.
const connections = new Set();

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/durableObjectTest", async (c) => {
  const id = c.env.WebhookReceiver.idFromName("default");
  const stub = c.env.WebhookReceiver.get(id);
  return stub.fetch(c.req.raw);
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get(
  "/ws",
  upgradeWebSocket((c) => {
    const { id } = c.req.query();
    console.log(`WebSocket opened for id ${id}`);

    return {
      onOpen: (ws) => {
        connections.add(ws);
        console.log("WebSocket opened");
      },
      onMessage: (event, ws) => {
        console.log(`Received message for id ${id}: ${event.data}`);
        connections.forEach((connection) => {
          if (connection !== ws) {
            connection.send(event.data);
          }
        });
      },
      onError: (error, ws) => {
        console.log(`WebSocket error for id ${id}: ${error}`);
      },
      onClose: () => {
        console.log("WebSocket closed");
      },
    };
  }),
);

export default app;
