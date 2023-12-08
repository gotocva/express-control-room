

let clients = [];

const defaultLogStream = (request, response, next) => {

    const initMessage = {
        event: 'DEFAULT_LOG_INIT',
        status: true,
        message: 'DATA',
        data: {}
    }
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);

    const data = `data: ${JSON.stringify(initMessage)}\n\n`;

    response.write(data);

    const clientId = Date.now();

    const newClient = {
        id: clientId,
        response
    };

    clients.push(newClient);

    request.on('close', () => {
        // console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
}


function emitDefaultLog(log) {
    const data = {
        event: 'DEFAULT_LOG',
        status: true,
        message: 'DATA',
        data: log
    }
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(data)}\n\n`))
}


module.exports = {
    defaultLogStream,
    emitDefaultLog
}