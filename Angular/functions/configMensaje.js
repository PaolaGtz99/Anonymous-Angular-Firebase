const nodemailer = require('nodemailer');

module.exports = (formulario) => {
 var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
 user: 'anonymousabmodel@gmail.com', // Cambialo por tu email
 pass: 'peligrosita' // Cambialo por tu password
 }
 });

const mailAnon = {
 from: `${formulario.name} <${formulario.email}>`,
 to: 'anonymousabmodel@gmail.com', // Cambia esta parte por el destinatario
 subject: "Pregunta de usuario Anonymous",
 html: `
 <strong>Nombre:</strong> ${formulario.name} <br/>
 <strong>E-mail:</strong> ${formulario.email} <br/>
 <strong>Pregunta:</strong> ${formulario.message}
 `
 };

 const mailUser = {
    from: `Anonymous <anonymousabmodel@gmail.com>`,
    to: `${formulario.email}`, // Cambia esta parte por el destinatario
    subject: "Tenemos tu duda",
    html: `
    <body style="margin: 0; padding: 0;">
       <table border="0" cellpadding="0" cellspacing="0" width="100%">	
           <tr>
               <td style="padding: 10px 0 30px 0;">
                   <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                       <tr>
                           <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                               <img src="https://i.ibb.co/PWsCWnm/Anon-Email.png" alt="Anonymous" width="300" height="230" style="display: block;" />
                           </td>
                       </tr>
                       <tr>
                           <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                               <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                   <tr>
                                       <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                           <b>¡Gracias por preguntar!</b>
                                       </td>
                                   </tr>
                                   <tr>
                                       <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                           Para el equipo de Anonymous siempre estarán primero nuestros usuarios. En un lapso corto de tiempo alguien del equipo se encargará de responder tus dudas en un correo directo a tu dirección email.
                                       </td>
                                   </tr>
                               </table>
                           </td>
                       </tr>
                       <tr>
                           <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
                               <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                   <tr>
                                       <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
                                           ISC 6to A, UAA 2020<br/>
                                       </td>
                                       <td align="right" width="25%">
                                           <table border="0" cellpadding="0" cellspacing="0">
                                               <tr>
                                                   <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                                       <a href="https://twitter.com/uaa_mx" style="color: #ffffff;">
                                                           <img src="https://i.ibb.co/6Hzrnx0/tw.gif" alt="Twitter" width="38" height="38" style="display: block;" border="0" />
                                                       </a>
                                                   </td>
                                                   <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                                   <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                                       <a href="https://www.facebook.com/uaa.mexico/?ref=br_rs" style="color: #ffffff;">
                                                           <img src="https://i.ibb.co/zb0yZVH/fb.gif" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
                                                       </a>
                                                   </td>
                                               </tr>
                                           </table>
                                       </td>
                                   </tr>
                               </table>
                           </td>
                       </tr>
                   </table>
               </td>
           </tr>
       </table>
   </body>
    `
   
    };

transporter.sendMail(mailAnon, function (err, info) {
 if (err)
 console.log(err)
 else
 console.log(info);
 });

 transporter.sendMail(mailUser, function (err, info) {
    if (err)
    console.log(err)
    else
    console.log(info);
    });
}