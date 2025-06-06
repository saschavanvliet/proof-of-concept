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

const cases1Response = await fetch(API + '/wp/v2/cases?per_page=8')
const cases1ResponseJSON = await cases1Response.json();

const cases2Response = await fetch(API + '/wp/v2/cases?per_page=8&offset=8')
const cases2ResponseJSON = await cases2Response.json();

const cases3Response = await fetch(API + '/wp/v2/cases?per_page=8&page=3')
const cases3ResponseJSON = await cases3Response.json();

app.get('/', async function (request, response) {
    response.render('index.liquid', {
  });
});

app.get('/cases', async function (request, response) {
    response.render('cases.liquid', {
      cases1: cases1ResponseJSON
  });
});

app.get('/cases/page2', async function (request, response) {
    response.render('page2.liquid', {
        cases2: cases2ResponseJSON
    });
});

app.get('/cases/page3', async function (request, response) {
    response.render('page3.liquid', {
        cases3: cases3ResponseJSON
    });
});

// Port live zetten 
app.set('port', process.env.PORT || 8888);
app.listen(app.get('port'), () => {
  console.log(`App running on http://localhost:${app.get('port')}`);
});