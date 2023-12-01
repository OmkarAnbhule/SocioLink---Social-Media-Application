
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'vernon.ebert91@ethereal.email',
        pass: 'PzWdNeaFF2tAqa7QSH'
    }
});
// send email
await transporter.sendMail({
    from: 'vernon.ebert91@ethereal.email',
    to: 'omkaranbhule12@gmail.com',
    subject: 'Test Email Subject',
    html: '<h1>Example HTML Message Body</h1>'
});