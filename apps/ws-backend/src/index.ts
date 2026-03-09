import { WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {
  ws.on('error', console.error);
  const url = request.url;
  if(!url){
    return;
  }

  const queryParams= new URLSearchParams(url.split('?')[1])
  const token = queryParams.get("token");
  const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string);

  if(!decoded){
    return;
  }

  ws.on('message', function message(data) {
    console.log("Server is running on port 8080")
    ws.send('pong')
  });

});