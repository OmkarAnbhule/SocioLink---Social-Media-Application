const User = require('../../user/models/UserModel');
const User = require('../../user/models/LoginUserModel');
const OTP = require('../models/otp_model')
module.exports = async (req, resp) => {
    try {
        const { email, name, password, username, otp } = req.body;
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (response.length === 0 || otp !== response[0].otp) {
            resp.status(500).send({ Response: 'Invalid' })
        }
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
        }
        const user = await User.create({ email, name, password: hashedPassword, username });
        const login = await Log.create({ log_id: email })
        let temp = await login.save()
        let result = await user.save();
        result = result.toObject();
        temp = temp.toObject()
        if (result) {
            console.log(temp)
            delete temp.password;
            delete result.password;
            resp.send({ Response: "Success" });
            console.log(result);
        }
        else {
            resp.status(201).send({ Response: "something went wrong" });
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({Response:"internal Server Error"});
    }
}