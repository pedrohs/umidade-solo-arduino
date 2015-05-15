# Umidade do solo com arduino e node.js
Sistema simples que pega informações do solo usando sensor de umidade higrômetro com arduino uno.

### Instalação

```bash
$ git clone https://github.com/pedrohs/umidade-solo-arduino.git
$ cd umidade-solo-arduino
$ npm install
$ bower install
$ node app.js
```
### Configuração do arduino

- Abra a IDE do Arduino, selecione: File > Examples > Firmata > StandardFirmata.
- Clique no botão Upload.

### Dependências utilizadas
* [Johnny Five](https://github.com/rwaldron/johnny-five)
* [Cron](https://github.com/ncb000gt/node-cron)
* [Async](https://github.com/caolan/async)
* [Connect](https://github.com/senchalabs/connect)
* [Connect-route](https://github.com/baryshev/connect-route)
* [neDB](https://github.com/louischatriot/nedb)
* [serve-static](https://github.com/expressjs/serve-static)
* [Socket.io](https://github.com/Automattic/socket.io)
* [Moment](https://github.com/moment/moment)

### Imagen
![Painel de Controle](http://i61.tinypic.com/2agw3lz.png)

### FAQ
* Para acessar o painel:
  Depois de iniciar o servidor acesse pelo navegador: http://localhost:3000/

###
* Atualização! foi removido o antigo sistema de salvamento das informações e substituído pelo [neDB](https://github.com/louischatriot/nedb)

### Contribuidores
* [gpedro](https://github.com/gpedro)
