// Belangrijke pakketten installeren
import express from 'express';
import { Liquid } from 'liquidjs';

// public & views map aanmaken
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('views', './views');

const API = 'https://labelvier.nl/wp-json';

const casesResponse = await fetch(API + '/wp/v2/cases')
const casesResponseJSON = await casesResponse.json();


app.get('/', async function (request, response) {
    response.render('index.liquid', {
      cases: casesResponseJSON
  });
});

app.get('/detail', async function (request, response) {
    response.render('detail.liquid', {
  });
});

// Port live zetten 
app.set('port', process.env.PORT || 8888);
app.listen(app.get('port'), () => {
  console.log(`App running on http://localhost:${app.get('port')}`);
});