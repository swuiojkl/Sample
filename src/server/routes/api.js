const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
const db = require('../db/index');
const convertMinsToHrsMins = require("../helper_function");

// CREATE
router.post("/movie", async function (req, res) {
    const data = req.body;
})


// READ
router.get("/movie/:name", async function (req, res) {
    const { name } = req.params;

    const r = await fetch(`https://www.omdbapi.com/?t=${name}&apikey=14ae431a`)
    const result = await r.json()
    let favorite = 0

    // Check Favorite
    const imdbID = result?.imdbID

    if (imdbID) {
        const imdbRec = await db
            .select('imdbID', 'Favorite')
            .from('Movie')
            .where({
                imdbID: imdbID
            })
            .first()

        if (imdbRec?.imdbID && imdbRec?.Favorite) {
            favorite = 1
        }
        result.favorite = favorite
    }


    res.send(result);
});

// UPDATE
router.put("/movie/:id", async function (req, res) {
    const { id } = req.params;
    const data = req.body;

    await db("Movie")
        .update({
            Title: data.Title,
            Description: data.Plot,
            ReleaseYear: data.Year,
            Duration: convertMinsToHrsMins(minute),
            Rating: Number(data.imdbRating)
        })
        .where('imdbID', id)
        .catch(e => {
            res.status(404).json(e)
        })
})

// DELETE
router.delete("/movie/:id", async function (req, res) {
    const { id } = req.params;

    await db("Movie")
        .where('imdbID', id)
        .del()
        .catch(e => {
            res.status(404).json(e)
        })

    res.status(200).json('success')
})

// ADD/REMOVE FAVORITE
router.put("/movie/favorite/:id", async function (req, res) {
    const { id } = req.params;
    const data = req.body;

    const r = await db
        .select('imdbID', 'Favorite')
        .from('Movie')
        .where({
            imdbID: id
        })
        .first()

    if (r?.imdbID) {
        await db("Movie")
            .update({
                Favorite: !r.Favorite
            })
            .where('imdbID', id)
            .catch(e => {
                res.status(404).json(e)
            })
    }
    else {
        let minute = data.Runtime.split(' ')[0]

        await db("Movie")
            .insert({
                imdbID: data.imdbID,
                Title: data.Title,
                Description: data.Plot,
                ReleaseYear: data.Year,
                Duration: convertMinsToHrsMins(minute),
                Rating: Number(data.imdbRating),
                Favorite: 1
            })
            .catch(e => {
                res.status(404).json(e)
            })
    }

    res.status(200).json('success')
})

module.exports = router;
