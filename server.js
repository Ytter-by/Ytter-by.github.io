const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Подключение к базе данных
const db = new sqlite3.Database('./pancakeShop.db');

// Разрешение доступа к статическим файлам
app.use(express.static('public'));

// API для получения данных из базы данных
app.get('/api/:category', (req, res) => {
    const category = req.params.category;
    let table;

    switch (category) {
        case 'new':
            table = 'NewItems';
            break;
        case 'meat':
            table = 'MeatPancakes';
            break;
        case 'sweet':
            table = 'SweetPancakes';
            break;
        case 'fish':
            table = 'FishPancakes';
            break;
        case 'vegetables':
            table = 'VegPancakes';
            break;
        case 'hot':
            table = 'HotDrinks';
            break;
        case 'cold':
            table = 'ColdDrinks';
            break;
        default:
            res.status(404).send('Category not found');
            return;
    }

    db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});