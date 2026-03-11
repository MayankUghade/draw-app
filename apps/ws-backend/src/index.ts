import { WebSocketServer, WebSocket } from 'ws';
import jwt, { decode } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {prisma} from "@repo/database/client"

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  room: string[],
  userId: number
}

const users: User[] = [];

function checkUser(token: string): number | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return null;
    }
    return decoded.id;
  } catch (error) {
    console.log(error);
    return null;
  }
  return null;
}

wss.on('connection', function connection(ws, request) {
  ws.on('error', console.error);

  // ✅ Read token from Authorization header
  const authHeader = request.headers['authorization'];
  const token = authHeader; 

  if (!token) {
    ws.close(1008, "Token missing");
    return;
  }

  const userId = checkUser(token);

  if (!userId) {
    ws.close(1008, "Invalid or expired token");
    return;
  }

  // Add user to list
if (!users.find(u => u.userId === userId)) {
  users.push({
    ws,
    room: [],
    userId
  });
}
console.log(users.length)

  ws.on('message', async function message(data) {
    const parsedData = JSON.parse(data as unknown as string)

    //logic when user wants to join the room 
    if(parsedData.type === "join_room") {
      const user = users.find(u =>u.ws === ws)
      console.log(parsedData.room)
      user?.room.push(parsedData.roomSlug)
      console.log(users)
    }

    //Logic when the user wants to leave the room
    if(parsedData.type === "leave_room"){
      const user = users.find(x => x.ws === ws)
      if(user){
        user.room = user.room.filter(room => room !== parsedData.roomSlug)
      }
    }

    //logic when the user wants to send a message to everyone in the room 
    if(parsedData.type === "chat"){
      const roomSlug = parsedData.roomSlug
      const message = parsedData.message

      await prisma.chat.create({
        data: {
          roomSlug: roomSlug,
          message: message,
          userId: userId
        }
      })
      users.forEach(user =>{
        if(user.room.includes(roomSlug)){
          user.ws.send(JSON.stringify({
            type: "chat",
            roomSlug,
            message,
          }))
        }
      })
    }
  });

  ws.on('close', () => {
    // Clean up user on disconnect
    const index = users.findIndex(u => u.userId === userId);
    if (index !== -1) users.splice(index, 1);
  });
});