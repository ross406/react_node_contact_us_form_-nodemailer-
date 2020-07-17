const express = require('express');
const bodyParser = require('body-parser');

const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// View engine setup

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact', { layout: false });
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>    
    <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: testAccount_user, // generated ethereal user
      pass: testAccount_pass, // generated ethereal password
    },
  });

  // setup email data with unicode symbols
  var mailOptions = {
    from: '"Query" <foo@example.com>', // sender address
    to: 'admin@scizers.com', // list of receivers
    subject: 'Contact Us Request', // Subject line
    text: 'Hello world?', // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.json({ status: 'Failed to send' });
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.status(200).json({
      status: 'Successfully Sent',
    });
    // res.render('contact', { layout: false }, { msg: 'Email has been sent' });
  });
});

app.listen(5000, console.log('Server started... on port 5000'));
