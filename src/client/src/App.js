import React, { useState, useEffect } from "react";
import "./App.css";
import { Grid, TextField, Card, CardMedia, CardContent, Typography, CardActions, IconButton, Tooltip } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios';

function App() {
    const [movie, setMovie] = useState([]);
    const [name, setName] = useState('')
    const [favorite, setFavorite] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (name !== '') {
                let movieRec = await axios.get("/api/movie/" + name)
                let movieData = await movieRec.data
                setMovie(movieData)
                setFavorite(movieData.favorite)
            }
            else {
                setMovie([])
            }
        }

        fetchData()
    }, [name]);


    const updateFavorite = async() => {
        await axios.put("/api/movie/favorite/" + movie.imdbID, movie)
        setFavorite(!favorite)
    }

    return (
        <div className="App">
            <h1>Movie Library</h1>

            <Grid container spacing={2} maxWidth="sm" sx={{ mx: "auto", marginBottom: '10px' }}>
                <Grid item xs={12}>
                    <TextField label="Movie Name" variant="standard" value={name} onChange={(e) => setName(e.target.value)} />
                </Grid>
            </Grid>

            {movie?.Title && <>
                <Card sx={{ maxWidth: 345, mx: "auto" }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={movie.Poster}
                        alt={movie.Title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {movie.Title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Release Year: {movie.Year}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Tooltip title="Add To Favorites">
                            <IconButton onClick={() => updateFavorite()}>
                                <FavoriteIcon style={{ color: favorite ? '#bb0303' : '#0000008a'}} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                            <IconButton>
                                <ShareIcon />
                            </IconButton>
                        </Tooltip>
                    </CardActions>
                </Card>
            </>}

            {(!movie?.Title && name !== '') && <p>No Movie Found</p>}
        </div>
    );
}

export default App;
