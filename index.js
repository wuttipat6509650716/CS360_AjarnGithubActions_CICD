const express = require('express');
const math = require('./src/math');

const app = express();
const PORT = process.env.PORT || 3000;

// Define API routes
app.get('/add', (req, res) => {
    const { x, y } = req.query;
    const result = math.add(Number(x), Number(y));
    res.json({ result });
});

app.get('/subtract', (req, res) => {
    const { x, y } = req.query;
    const result = math.subtract(Number(x), Number(y));
    res.json({ result });
});

app.get('/multiply', (req, res) => {
    const { x, y } = req.query;
    const result = math.multiply(Number(x), Number(y));
    res.json({ result });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
