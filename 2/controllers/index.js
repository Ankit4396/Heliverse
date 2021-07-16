'use strict'

const User = require("../models/user-model");
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'lkjhgfdsaasdfghjkl@#$%^&*()_+poiuytrewqqwertyuiop'

module.exports = {

    SignUpUser : signUp,
    LoginUser : loginUser,

}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */

async function signUp(req,res){

    console.log(req.body);
    const user_name =req.body['user_name'];
    let password = req.body['password'];
    password = await bcrypt.hash(password,10);
    try {
        const response = await User.create({
            user_name, password
        })

        console.log(response);
    }
    catch (error){
        console.log(error);
        return res.json({status:'error'});
    }


};

/**
 *
 * @param req
 * @param res
 */

function loginUser(req,res){

    const ID = req.body['id'] || null ;
    const PASSWORD = req.body['password'] || null;

    if(ID === null || PASSWORD === null){

        res.send("Bad Request");
        return
    }

    User.findOne(
        {
            user_name: String(ID).toLowerCase(),

        }
    ).select({user_name:1,_id:1,password:1})
        .lean()
        .exec()
        .then(user=>{

            if(user === null){

                res.send("No account with that username");
                return;
            }

            bcrypt.compare(

                PASSWORD,
                user.password,
                (err,isSame)=>{

                    if(err || !isSame){

                        res.send("Password Do not match");
                        return;
                    }
                    // jws token
                  const token = jwt.sign(
                      {
                      id:user._id,
                      username:user.user_name

                  },
                      JWT_SECRET
                  )


                   return res.json({status:'ok'});
                }
            )

        }).catch(err=>{
            res.send(err);
    });



};




