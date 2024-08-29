const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ismaelaspuacr.5@gmail.com',
        pass: 'sumn slyo bisp ysyi' 
    }
});

// Route to handle the form submission
app.post('/send-email', (req, res) => {
    const { nombre, email, telefono, message } = req.body;

    const mailOptions = {
        from: 'Pagina web',
        to: 'ismaelaspuacr.5@gmail.com',
        subject: 'Nuevo mensaje desde la página web',
        text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nMensaje: ${message}`

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(500).send('Error al enviar el correo.');
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Correo enviado correctamente.');
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
