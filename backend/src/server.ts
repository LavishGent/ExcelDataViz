// backend/app.ts
import express, { Request, Response } from 'express';
import { items } from '../mockData';
import { Item } from '../types';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
   res.json('homePage Nothing Here')
})

// Get all items
app.get('/api/items', (req: Request, res: Response) => {
    res.json(items);
});

// Get a single item by ID
app.get('/api/items/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const item = items.find((item: Item) => item.id === id);

    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: "Item not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
