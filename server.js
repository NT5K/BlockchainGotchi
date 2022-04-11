const express = require('express');
const app = express();
const htmlRoutes = require('./routing/htmlRoutes');
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.json({ type: 'application/*+json' }));

app.use(htmlRoutes);

require('./routing/htmlRoutes.js');

app.listen(port, () => console.log(`listening on port ${port}!`));