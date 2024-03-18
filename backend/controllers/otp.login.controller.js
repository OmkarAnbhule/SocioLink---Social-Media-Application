module.exports = async(req,resp)=>{
    const { log_id, otp } = req.body;
	const response = await OTP.find({ email: log_id }).sort({ createdAt: -1 }).limit(1);
	if (response.length === 0 || otp !== response[0].otp) {
		resp.send({ Response: 'Invalid' })
	} else {
		try {
			const user = await Log.create({ log_id });
			let result = await user.save();
			console.log(result)
			result = result.toObject();
			if (result) {
				delete result.password;
				resp.send({ Response: "Success" });
				console.log(result);
			}
			else {
				resp.send({ Response: "something went wrong" });
			}
		}
		catch (e) {
			console.log(e)
		}
	}
}