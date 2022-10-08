FROM denoland/deno:alpine-1.26.0

# EXPOSEはHerokuではサポートされていないが、ローカル用に残しておく。
EXPOSE $PORT

WORKDIR /home/render-test
COPY . .

RUN deno cache main.ts

CMD deno run -A main.ts