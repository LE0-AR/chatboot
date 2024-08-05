const socket = io();

document.getElementById('send-response').addEventListener('click', function() {
    const message = document.getElementById('response-input').value;
    const sessionId = document.getElementById('session-id').value; // Debes tener un campo para ingresar el ID de sesión

    if (!sessionId) {
        console.log('Error: No session ID provided.');
        return;
    }

    socket.emit('adminChat', {
        sessionId: sessionId,
        text: message
    });

    document.getElementById('response-input').value = '';
});

// Opcional: Recibir mensajes de clientes
socket.on('chat', function(message) {
    const messagesDiv = document.getElementById('messages');
    const el = document.createElement('div');
    el.innerHTML = `<b>${message.username}:</b> ${message.text}`;
    messagesDiv.appendChild(el);
});
