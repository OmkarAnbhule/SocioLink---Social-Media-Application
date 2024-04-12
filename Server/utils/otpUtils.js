const OTP = require('./otp/models/otp_model');
const otpGenerator = require('otp-generator');
const authToken = process.env.TWILLO_AUTH_TOKEN;
const accountSid = process.env.TWILLO_ACCOUNT_SID;
const verifySid = process.env.TWILLO_VERIFY_SID;
const client = require("twilio")(accountSid, authToken);


async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            `<h1>Please confirm your OTP</h1>
         <p>Here is your OTP code: ${otp}</p>`
        );
        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}

exports.sendEmailOtp = async (email) => {
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
    if (otpBody) {
        await sendVerificationEmail(email, otp);
        return true;
    }
}

exports.verifyEmailOtp = async (email, otp) => {
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
        resp.status(500).send({ Response: 'Invalid' })
        return false;
    }
    else {
        return true;
    }
}

exports.sendSMSOtp = async (email) => {
    const otpResponse = await client.verify.v2
        .services(verifySid)
        .verifications.create({ to: `+91${email}`, channel: "sms" })
    if(otpResponse){
        return true;
    }
}

exports.verfiySMSOtp = async (email, otp) => {
    const verify = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: `+91${email}`, code: otp })
    if (!verify) {
        resp.send({ Response: 'Invalid' })
        return false;
    }
    else {
        return true;
    }
}
