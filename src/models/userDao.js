const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error')

const getUserInfo = async(userId) => {
  return await appDataSource.query(`
    SELECT
      u.name AS userName, 
      uf.role_id AS roleId
    FROM users u 
    JOIN users_families uf
    ON u.id = uf.user_id
    WHERE u.id = ?;
    `, 
    [userId]
    )
};

const createUserByEmail = async(email) => {
  const result = await appDataSource.query(`
    INSERT INTO users (email) 
    VALUES (?)
    `,
    [email]
    );

  if (result.insertId === 0) {
  error.throwErr(500, 'DATA_INSERTION_FAILED');
  }
  else {
    return result.insertId;
  }
};


const addInformation = async(name, phoneNumber ,birthdate, email) => {
  const result = await appDataSource.query(
    `
    UPDATE users
    SET name = ?,
    phone_number = ?, 
    birthdate = ? 
    WHERE email = ?
    `,
    [name, phoneNumber, birthdate, email]
    )
  if (result.affectedRows === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
  }else{
    return result;
  }
};

const getUserInformationById = async( userId ) => {
  return await appDataSource.query(
    `
    SELECT
        u.id as userId,
        u.email,
        u.name,
        u.email,
        u.birthdate,
        u.phone_number,
        u.created_at,
        u.updated_at,
        u.deleted_at,
        uf.family_id as familyId,
        uf.role_id as roleId,
        f.auth_code
    FROM users u
      LEFT JOIN users_families uf on u.id = uf.user_id
      LEFT JOIN families f on uf.family_id = f.id
      WHERE u.id = ?
      `,
      [ userId ]
    )
}

const getNameById = async (userId) => {
  return await appDataSource.query(
    `
    SELECT name
    FROM users 
    WHERE id = ?
    `,
    [userId]
  )
}

module.exports = {
  createUserByEmail,
  addInformation,
  getUserInformationById,
  getUserInfo,
  getNameById,
}