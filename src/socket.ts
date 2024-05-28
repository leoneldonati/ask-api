import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { app } from './app'



const server = createServer(app)

// Socket web
const io = new Server(server)

io.on('connection', (socket) => {


  




})