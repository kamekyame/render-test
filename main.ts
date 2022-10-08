import {
  Application,
  Context,
  helpers,
  type Middleware,
  Router,
  type RouterContext,
  type RouterMiddleware,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const port = parseInt(Deno.env.get("PORT") || "8000");

const app = new Application();
app.use(
  oakCors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  const now = new Date().toISOString();
  console.log(
    `[${now}] ${ctx.response.status} ${ctx.request.method} ${ctx.request.url} - ${rt}`
  );
});

const router = new Router();
router.get("/stream", (ctx) => {
  let timerId: number;
  const rs = new ReadableStream({
    start(controller) {
      timerId = setInterval(() => {
        try {
          controller.enqueue("Hello World! Stream");
        } catch (err) {
          console.log("error: ", err);
        }
      }, 1000);
    },
    cancel() {
      clearInterval(timerId);
    },
  });

  ctx.response.body = rs;
});

router.get("/ws", (ctx) => {
  console.log(ctx.isUpgradable);
  if (ctx.isUpgradable) {
    const sock = ctx.upgrade();
    const timerId = setInterval(() => {
      if (sock.readyState !== WebSocket.CLOSED) {
        sock.send("Hello World! WebSocket");
      } else {
        clearInterval(timerId);
      }
    }, 1000);
  }
  ctx.response.status = 200;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port });
