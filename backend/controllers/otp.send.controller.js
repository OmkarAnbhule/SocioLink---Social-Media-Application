const OTP = require('./otp/models/otp_model');

module.exports = async (req, resp) => {
    const { email } = req.body;
    let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
        });
        result = await OTP.findOne({ otp: otp });
    }
    const otpBody = await OTP.create({ email, otp });
    resp.status(201).send({ Response: 'Success' })
}
