const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const { bookmarks } = require('../store')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
    .route('/bookmarks')
    .get((req, res) => {
        res
        .json(bookmarks);
    })
    .post(bodyParser, (req, res) => {
        const {title, url, description, rating} = req.body;
        if(!url){
            logger.error('Url is required');
            return res
                .status(400)
                .send('Invalid data');
        }
        
        if(isNaN(rating) || rating < 0 || rating > 5){
            logger.error('Rating must be a number between 0 and 5');
            return res
                .status(400)
                .send('Invalid data');
        }
        
        const id = uuid();

        const bookmark = {
            id,
            title,
            url,
            description,
            rating
        }

        bookmarks.push(bookmark);

        logger.info(`Bookmarked ${url} with id ${id} created`);
        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json(bookmark);
    })


    bookmarkRouter
        .route('/bookmarks/:id')
        .get((req, res) => {
            const { id } = req.params;
            const bookmark = bookmarks.find(b => b.id == id);

            if(!bookmark){
                logger.error(`Bookmark with id ${id} not found.`)
                return res
                    .status(404)
                    .send('Bookmark not found');
            }

            res.json(bookmark);
        })
        .delete((req, res) => {
            const { id } = req.params;
            const bookmarkIndex = bookmarks.findIndex(b => b.id == id)

            if(bookmarkIndex === -1){
                logger.error(`Bookmark with id ${id} not found.`);
                return res
                    .status(404)
                    .send('Bookmark not found');
            }
            
            const url = bookmarks[bookmarkIndex].url;
            bookmarks.splice(bookmarkIndex, 1);

            logger.info(`Bookmark ${url} with id ${id} was deleted.`)

            res
                .status(204)
                .end()
           
        })

        module.exports = bookmarkRouter
