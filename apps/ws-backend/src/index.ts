import { WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {
  ws.on('error', console.error);
  const url = request.url;
  if(!url){
    return;
  }

  const queryParams= new URLSearchParams(url.split('?')[1])
  const token = queryParams.get("token");
  if(!JWT_SECRET){
    throw new Error("JWT_SECRET not defined");
  }
  const decoded = jwt.verify(token as string, JWT_SECRET);

  if(!decoded){
    return;
  }

  ws.on('message', function message(data) {
    console.log("Server is running on port 8080")
    ws.send('pong')
  });

});