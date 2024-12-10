const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Endpoint para enviar correo
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 587,
      auth: {
        user: process.env.MAILTRAP_USER, // Usuario de Mailtrap
        pass: process.env.MAILTRAP_PASS, // Contraseña de Mailtrap
      },
    });

    await transporter.sendMail({
      from: email,
      to: "saluroblesteran@gmail.com",
      subject: "Nuevo mensaje desde el formulario de contacto",
      text: message,
      html: `<p><strong>Nombre:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mensaje:</strong></p>
             <p>${message}</p>`,
    });

    res.status(200).json({ message: 'Email enviado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al enviar el email.' });
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
