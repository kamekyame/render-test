const baseUrl = new URL("http://localhost:8000/");

const type = Deno.args[0];
if (type === "stream") {
  const url = new URL("/stream", baseUrl);
  const res = await fetch(url.toString(), {});
  console.log(res);

  if (res.body) {
    for await (const chunk of res.body) {
      // console.log(chunk);
      const str = new TextDecoder().decode(chunk);
      console.log("getData: ", str);
    }
  }
} else {
  let url = baseUrl.protocol === "https:" ? "wss:" : "ws:";
  url += "//" + baseUrl.host + "/ws";
  const ws = new WebSocket(url);
  ws.onmessage = (ev) => {
    console.log(ev.data);
  };
}
