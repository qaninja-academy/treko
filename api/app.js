import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

mongoose.set('useFindAndModify', false);

import crud from "./crud";

const app = express();

app.use(cors({
    origins: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://127.0.0.1/trekodb', { useNewUrlParser: true });

app.get('/task', crud.list)
app.get('/task/:id', crud.get)
app.delete('/task/:id', crud.remove)
app.post('/task', crud.create)
app.put('/task/:id', crud.update)

app.listen(3000, () => {
    console.log("Treko API está no AR!");
});

module.exports = app;
