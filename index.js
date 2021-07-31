const mc = require('minecraft-protocol')
const socks = require('socks').SocksClient
const ProxyAgent = require('proxy-agent')
const fs = require('fs');
const randomstring = require("randomstring");
const socks4run = require('./socks4.js')

if (process.argv.length < 6 || process.argv.length > 8) {
  console.log('Usage : node client_socks_proxy.js <host> <port>')
}
const proxies = fs.readFileSync("socks5.txt", 'utf-8').replace(/\r/gi, '').split('\n').filter(Boolean);
const proxies4 = fs.readFileSync("socks4.txt", 'utf-8').replace(/\r/gi, '').split('\n').filter(Boolean);
const hostserver = process.argv[2]
const hostport = process.argv[3]

function socks5run(hostserver, hostport) {
    const data1 = proxies[Math.floor(Math.random() * proxies.length)];
const deletecolon = data1.split(':')


// This part tests the proxy
// You can comment out this part if you know what you are doing

const name = randomstring.generate({
    length: 12,
    charset: 'alphabetic'
  });

    require('http').get({
        method: 'GET',
        host: 'ifconfig.me',
        path: '/',
        agent: new ProxyAgent({ protocol: 'socks5:', host: deletecolon[0], port: deletecolon[1] })
      }, (res) => {
        if (res.statusCode === 200) {
          process.stdout.write('Proxy ok ip: ')
         // res.pipe(process.stdout)
          res.on('close', () => {
            process.stdout.write('\nProxy Connection closed\n')
          })
        } else {
          console.log('Proxy not working')
        }
      })
      
      const client = mc.createClient({
        connect: client => {
          socks.createConnection({
            proxy: {
              host: deletecolon[0],
              port: parseInt(deletecolon[1]),
              type: 5
            },
            command: 'connect',
            destination: {
              host: process.argv[2],
              port: parseInt(process.argv[3])
            }
          }, (err, info) => {
            if (err) {
              console.log('Have error')
              return
            }
      
            client.setSocket(info.socket)
            client.emit('connect')
          })
        },
        agent: new ProxyAgent({ protocol: 'socks5:', host: deletecolon[0], port: deletecolon[1] }),
        username: name,
       // password: process.argv[7]
      })
      
      client.on('connect', function () {
        console.info('connected')
      })
    //  client.on('disconnect', function (packet) {
     //   console.log('disconnected: ' + packet.reason)
    //  })
     // client.on('end', function () {
     //   console.log('Connection lost')
     // })
     // client.on('error', function (error) {
      //  console.log('Client Error', error)
     // })
     // client.on('kick_disconnect', (reason) => {
      //  console.log('Kicked for reason', reason)
     // })
      //client.on('chat', function (packet) {
      //  const jsonMsg = JSON.parse(packet.message)
       // if (jsonMsg.translate === 'chat.type.announcement' || jsonMsg.translate === 'chat.type.text') {
        //  const username = jsonMsg.with[0].text
       //   const msg = jsonMsg.with[1]
        //  if (username === client.username) return
       //   client.write('chat', { message: msg })
     //   }
   //   })
}
// ---------------- sock 4 server
setInterval(() => {
    socks5run();
    socks4run(hostserver, hostport);
}, 10);