module.exports = {
    // 64 random hexadecimal characters (0-9 and A-F), generated from https://www.grc.com/passwords.htm
      JwtKey: 'A7001005B96967A01A38B02659DA49D3553C9496B90C100ADAEFC78F8749C6F6'
    };
    // SSL
  //   var options = {
  //     key: fs.readFileSync('./key.pem', 'utf8'),
  //     cert: fs.readFileSync('./server.crt', 'utf8')
  //  };


//    openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
// openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt