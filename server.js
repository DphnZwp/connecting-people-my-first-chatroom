const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4242
let count = 0

app.use(express.static(path.resolve('public')))

io.on('connection', (socket) => {
  console.log('a user connected', socket.id)
  // Counting users when users connect
  count++
  io.emit('usercount', count)

  socket.on('chat', (data) => {
    io.emit('chat', data)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id)
    // Decrease counting when users disconnect
    count--
    io.emit('usercount', count)
  })

  socket.on('typing', function(data){
    socket.broadcast.emit('typing', data);
})
})

http.listen(port, () => {
  console.log('listening on port ', port)
})