const { appDataSource } = require('../utils/dataSource');

const getCategoriesByIds = async (categoryIds) => {
  return await appDataSource.query(
    `
    SELECT id, category as 'option'
    FROM categories
    WHERE id IN (?)
    `,
    [categoryIds]
  )
}

const getIdByCategoryName = async (category) => {
  return await appDataSource.query(
    `
    SELECT id as categoryId 
    FROM categories
    WHERE category = ? 
    `,
    [category]
  )
}

const getNameById = async (categoryId) => {
  return await appDataSource.query(
    `
    SELECT category 
    FROM categories 
    WHERE id = ?
    `,
    [categoryId]
  )
}

module.exports = {
  getCategoriesByIds,
  getIdByCategoryName,
  getNameById
}