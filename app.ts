//server.js
import express, { Request, Response } from 'express';
import Item from './src/Item';
import User from './src/User';

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.get('/items', (request: Request, response: Response) => {
    const items = [
        new Item("item 1", "content", new Date(Date.now())),
        new Item("item 2", "content", new Date(Date.now())),
        new Item("item 3", "content", new Date(Date.now()))
    ]

    response.status(200).json(items);
})

export default app;