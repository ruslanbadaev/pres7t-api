const model = require('../models/event')
const { matchedData } = require('express-validator/filter')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
require('../../config/passport')
/*********************
 * Private functions *
 *********************/

/**
 * Gets all items from database
 */
const getAllItemsFromDB = async () => {
  return new Promise((resolve, reject) => {
    model.find(
      {},
      '-updatedAt -createdAt',
      {
        sort: {
          name: 1
        }
      },
      (err, items) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message))
        }
        resolve(items)
      }
    )
  })
}

/********************
 * Public functions *
 ********************/

/**
 * Get all items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getAllItems = async (req, res) => {
  try {
    res.status(200).json(await getAllItemsFromDB())
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query)
    res.status(200).json(await db.getItems(req, model, query))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemsByPosition = async (req, res) => {
  try {
    console.log(req.query)
    console.log(req.body)
    req = utils.checkDataContained(req)

    console.log(req)

    console.log(req.lat === undefined || req.lng === undefined)
    if (req.lat === undefined || req.lng === undefined) {
      utils.handleError(res, { code: 422, message: 'LOCATION_NOT_FOUND' })
    }

    res.status(200).json({
      docs: await db.getItemByParams(
        {
          $and: [
            {
              'location.lat': {
                $gte: req.lat - 1,
                $lte: req.lat + 1
              }
            },
            {
              'location.lng': {
                $gte: req.lng - 1,
                $lte: req.lng + 1
              }
            }
          ]
        },
        { _id: 1, type: 1, title: 1, location: 1 },

        model
      )
    })
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItemsByStatus = async (req, res) => {
  try {
    req.projection = { _id: 1, type: 1, title: 1 }
    res.status(200).json(
      await db.getItemByParamsAndPaginate(req, model, {
        $and: [
          {
            'location.lat': {
              $gte: req.body.lat - 1,
              $lte: req.body.lat + 1
            }
          },
          {
            'location.lng': {
              $gte: req.body.lng - 1,
              $lte: req.body.lng + 1
            }
          }
        ]
      })
    )
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.getItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.updateItem(id, model, req))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
  try {
    // console.log(jwtExtractor(req))
    console.log(req.user)
    const userId = req.user._id
    req = matchedData(req)
    req.creatorId = userId
    res.status(201).json(await db.createItem(req, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.deleteItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}
