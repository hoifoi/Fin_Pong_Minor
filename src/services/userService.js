const userDao = require('../models/userDao');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const signInSignUp = async (code) => {
  try {
    const authUrl = 'https://kauth.kakao.com/oauth/token';  // 프론트에게 받은 토큰을 전송하는 곳
    const userUrl = 'https://kapi.kakao.com/v2/user/me';    // 

    const authParams = {
      grant_type: process.env.KAKAO_GRANT_TYPE,
      client_id: process.env.KAKAO_CLIENT_ID,
      client_secret : process.env.KAKAO_CLIENT_SECRET,
      redirect_uri: process.env.AUTH_REDIRECT_URI,
      code,
    };
    
    const authToken = await axios.post(authUrl, {}, {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
      },
      params: authParams,
    });

    const kakaoAccessToken = authToken.data.access_token;

    const result = await axios.get(userUrl, {
      headers: {
        'content-type' : 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization : `Bearer ${kakaoAccessToken}`,
      },
    });
    if (!result || result.status !== 200) {
      throw new Error('KAKAO_CONNECTION_ERROR');
    }

    const email = result.data.kakao_account.email;
    const existingUser = await userDao.getUserByEmail(email);
    console.log('existingUser',existingUser)

    if (existingUser.length === 0) {
      const createUser = await userDao.createUserByEmail(email);
      const token = jwt.sign({ email: email, id: createUser }, process.env.TYPEORM_SECRET_KEY);
      return {
        needsAdditionalInfo: true,
        message: 'LOG_IN_SUCCESS',
        token: token,
        email: email,
        id: createUser,
      };
    } else {
      const token = jwt.sign({ email: email, id: existingUser[0].id }, process.env.TYPEORM_SECRET_KEY);
      return {
        needsAdditionalInfo: false,
        message: 'LOG_IN_SUCCESS',
        token: token,
        email: email,
        id: existingUser[0].id,
      };
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};


const addInformation = async(name, phoneNumber ,birthdate, email) => {
  try{
    return await userDao.addInformation(name, phoneNumber ,birthdate, email);
  } catch(err) {
    console.log(err);
    throw err;
  }
};

const userInfo = async(userId) => {
  const [result] =  await userDao.getUserInfo(userId)
  return result
}

const getNameById = async (userId) => {
  const result = await userDao.getNameById(userId);
  return result[0].name;
}

module.exports = {
  signInSignUp,
  addInformation,
  userInfo,
  getNameById
}