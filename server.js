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

// const API = 'https://labelvier.nl/wp-json';

const APIcases = 'https://labelvier.nl/wp-json/wp/v2/cases?per_page=8'; // Door 'cases?per_page=8' in de URL toe te voegen worden er per pagina steeds maar acht projecten geladen opeenvolgend.

app.get('/', async function (request, response) {
    response.render('index.liquid', {
  });
});

// Twee routes worden aangemaakt met de onderstaande regel. :page is de routeparameter voor de verschillende pagina's.
app.get(['/cases', '/cases/page:page'], async (req, res) => {
    let page = req.params.page || 1;

    try {
        const response = await fetch(`${APIcases}&page=${page}`); // Door &page=${page} toe te voegen vraag je de juiste pagina van de paginering op. 
        const cases = await response.json();
        const totalPages = response.headers.get('X-WP-TotalPages');

        res.render('cases.liquid', {
            cases,
            currentPage: Number(page),
            totalPages: Number(totalPages)
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Fout bij het ophalen van data.');
    }
});

app.get('/contact', (req, res) => {
  res.render('contact.liquid');
});

app.get('/404', (req, res) => {
  res.render('404.liquid');
});

app.use((req, res) => {
  res.status(404).render('404.liquid');
});

// Port live zetten 
app.set('port', process.env.PORT || 8888);
app.listen(app.get('port'), () => {
  console.log(`App running on http://localhost:${app.get('port')}`);
});