const express = require('express');
const app = express();
const PORT = 5050;

app.get('/', (req, res) => res.send('Test Server Working!'));

app.listen(PORT, () => console.log(`✅ Test Server Running on ${PORT}`));
