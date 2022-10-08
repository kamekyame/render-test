const baseUrl = new URL("http://localhost:8000/");
// const baseUrl = new URL("https://render-test-io93.onrender.com/");

const type = Deno.args[0];
const stream = async () => {
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
};
const ws = async () => {
  let url = baseUrl.protocol === "https:" ? "wss:" : "ws:";
  url += "//" + baseUrl.host + "/ws";
  const ws = new WebSocket(url);
  ws.onmessage = (ev) => {
    console.log(ev.data);
  };
};

// if (type === "stream") {
stream();
// } else {
ws();
// }
