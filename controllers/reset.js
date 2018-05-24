const User = require('../models/user');
const nodemailer = require('nodemailer');
const helperFunction = require('../helpers/helper');


exports.getCode = async (req, res, next) => {
    const user = await User.findOne({'email': req.body.email});
    
    if(!user){
        return res.status(200).json({title: "Get Code Error", message: `No Account With That Email Exist Or Email is Invalid`});
    }
    
    const token = helperFunction.RandomValue(5);
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 60*60*1*1000; 
    
    await user.save();
    
    const smtpTransport = nodemailer.createTransport({
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        to: user.email,
        from: 'Kick '+'<'+process.env.EMAIL+'>',
        subject: 'Kick Password Reset Token',
        text: `You have requested for password reset token. \n`
        + `Use this token to reset your password: ${token} `
    };

    smtpTransport.sendMail(mailOptions, (err, response) => {
        if(err){
            return next(err)
        }
        return res.status(200).json({title: "Token Sent", message: `A reset token has been sent to ${user.email}`});
    });
}

exports.resetPassword = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email, passwordResetExpires: {$gt: Date.now()}});
    
    if(!user){
        return res.status(200).json({
            title: "Token Expired Error", 
            message: `Password reset token has expired or is invalid. Enter your email to get a new token.`
        });
    } else {
        if(req.body.password.length < 5){
            return res.status(200).json({title: 'Password Error', message: 'Password must not be less than 5 characters.'});
        }

        if(req.body.password){
            user.password = User.encryptPassword(req.body.password);
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            await user.save();

            const smtpTransport = nodemailer.createTransport({
                host: 'smtp.zoho.eu',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
    
            const mailOptions = {
                to: user.email,
                from: 'Kick '+'<'+process.env.EMAIL+'>',
                subject: 'Password update successful',
                text: `This is a confirmation that you changed the password for ${user.email}`
            };
    
            smtpTransport.sendMail(mailOptions, (err, response) => {
                if(err){
                    return next(err)
                }
                return res.status(200).json({
                    title: "Password Reset Successful", 
                    message: `Your password has been successfully updated. You can now login`
                });
            });
        }
    }
    
    
}













