const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid'); // Para generar IDs únicos
require('dotenv').config({ path: 'data.env' });

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Configura Nodemailer usando las variables de entorno
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Función para enviar correos electrónicos
function sendEmail(to, subject, text) {
    if (!to) {
        console.log('Error: No recipient email address provided.');
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('Error al enviar el correo:', error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
}

app.use(express.static(path.join(__dirname + "/public")));

const sessions = {};  // Objeto para almacenar las sesiones de chat

io.on("connection", function(socket) {
    console.log("Nuevo cliente conectado");

    socket.on("join", function(data) {
        const sessionId = uuidv4(); // Genera un ID único para la sesión
        sessions[sessionId] = { email: data.email, socketId: socket.id };
        console.log("Nueva sesión creada con ID:", sessionId);

        socket.join(sessionId);
        socket.emit("sessionCreated", sessionId); // Envía el ID de sesión al cliente

        socket.broadcast.emit("update", `${data.username} se unió a la conversación`);
    });

    socket.on("exituser", function(data) {
        const sessionId = Object.keys(sessions).find(id => sessions[id].socketId === socket.id);
        if (sessionId) {
            socket.broadcast.to(sessionId).emit("update", `${data.username} abandonó la conversación`);
            delete sessions[sessionId];
        }
    });

    socket.on("chat", function(message) {
        const sessionId = Object.keys(sessions).find(id => sessions[id].socketId === socket.id);
        if (!sessionId) {
            console.log('Error: No session found for socket.');
            return;
        }

        socket.broadcast.to(sessionId).emit("chat", message);

        // Enviar notificación por correo electrónico
        const userEmail = sessions[sessionId].email;
        const subject = `Nuevo mensaje de ${message.username}`;
        const text = `${message.username} dice: ${message.text}`;
        sendEmail(userEmail, subject, text);
    });

    // Nuevo evento para responder como admin
    socket.on("adminChat", function(message) {
        if (!sessions[message.sessionId]) {
            console.log('Error: No session found.');
            return;
        }

        // Enviar mensaje al cliente
        io.to(sessions[message.sessionId].socketId).emit("chat", {
            username: "Admin",
            text: message.text
        });

        // Enviar correo electrónico al cliente
        const userEmail = sessions[message.sessionId].email;
        const subject = `Respuesta de Admin: ${message.text}`;
        const text = `Admin dice: ${message.text}`;
        sendEmail(userEmail, subject, text);
    });

    socket.on("disconnect", function() {
        console.log("Cliente desconectado:", socket.id);
        Object.keys(sessions).forEach(sessionId => {
            if (sessions[sessionId].socketId === socket.id) {
                delete sessions[sessionId];
            }
        });
    });
});

server.listen(5000, () => {
    console.log("Servidor escuchando en el puerto 5000");
});
