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

// Algemene variabelen:
const API = 'https://labelvier.nl/wp-json';

const APIcases = (API + '/wp/v2/cases?per_page=8'); // Door 'cases?per_page=8' in de URL toe te voegen worden er per pagina steeds maar acht projecten geladen opeenvolgend.

app.get('/', async function (request, response) {
    response.render('index.liquid', {
  });
});

// MAIN PAGE: overzichtspagina alle cases
app.get(['/cases', '/cases/page:page'], async function (request, response) {
  // De standaardpagina is 1. Dit is dus de eerste pagina die geladen wordt. Er worden acht cases per pagina geladen en dit zijn de 'APIcases'.
  const page = request.params.page || 1;

  // Maak de URL met de bijbehorende pagina. De variabele 'page' wordt dus toegevoegd aan de 'APIcases' door gebruik te maken van '&page='. Hiermee wordt er dus een stukje extra parameter toegevoegd aan de URL.
  const pagesResponse = await fetch(APIcases + '&page=' + page);
  const pagesResponseJSON = await pagesResponse.json();

  // Dit is het totaal aantal pagina's:
  const totalPages = pagesResponse.headers.get('X-WP-TotalPages');

  // De pagina wordt gerenderd op 'cases' want er hoeft geen extra liquid template aangemaakt te worden voor elke nieuwe pagina die zou worden toegevoegd.
    response.render('cases.liquid', {
      cases: pagesResponseJSON,
      currentPage: Number(page),
      totalPages: Number(totalPages)
    });
});

// DETAILPAGE case
app.get('/cases/case/:slug', async function (request, response) {
  const slug = request.params.slug; // Parameter voor de slug van de desbetreffende case wordt aangemaakt door deze variabele.

  // De URL van de case met de slug erbij wordt met caseResponse aangemaakt:
  const caseResponse = await fetch(API + '/wp/v2/cases?slug=' + slug);
  const caseResponseJSON = await caseResponse.json();

  const caseData = caseResponseJSON[0]; // De eerste lijst uit de array wordt gepakt (eerste case opbject)
  
  // Personen uit 'cases' JSON-bestand. Deze mensen moeten worden gekoppeld aan het 'users' JSON-bestand. Dus in het ene bestand staat er wie er hebben gewerkt aan een case en in het andere staat inhoudelijk wie het is.
  // Er is een onderverdeling van projectleiders en teams (mensen in een team dus).
  const projectleiderId = caseData.acf.case_projectleider; 
  const teamIds = caseData.acf.case_team || []; // <- Haakjes: Als er niemand in een team zit, laat dan een lege lijst zien. Anders krijg je moeilijkheden met de for-loop, omdat er undefined zou staan.
  const allUserIds = [...new Set([projectleiderId, ...teamIds].filter(Boolean))]; // Er wordt EEN array gemaakt van alle projectleiders en teamleden. Bijvoorbeeld: [4, 5, 6]. Het Boolean-filter zorgt ervoor dat er geen lege waardes komen te staan, maar alleen echte id's. New Set zorgt ervoor dat er geen dubbele id's zijn.

    let usersData = []; // veranderende variabele
    if (allUserIds.length > 0) { // Als er niks in de 'allUserIds' zit wordt er ook geen API-aanroep gedaan.
      const userIdsParam = allUserIds.join(','); // Met 'join' wordt er een string gemaakt van de array. [4, 7, 12] naar "4,7,12" bijv.
      const usersResponse = await fetch(API + '/wp/v2/users?include=' + userIdsParam); // Alleen de gebruikers die we aanroepen worden in de URL gezet. Met dus de juiste parameter van de UserId's.
      usersData = await usersResponse.json(); // Alle data wordt opgeslagen in de lege variabele.
    }

    const projectleider = usersData.find(user => user.id === projectleiderId); // In de UsersData (de lijst met alle variabelen uit de User-JSON) moeten de getallen (id's) overeenkomen met de id's uit de cases-JSON.
    const teamleden = usersData.filter(user => teamIds.includes(user.id)); // Alleen de gebruikers die in het team zitten worden geladen.

    response.render('detail.liquid', { // Er wordt een losse detailpage aangemaakt waarbij alle informatie van een specifieke case wordt geladen. Aan de hand van de gemaakte variabelen kunnen ook alle teamleden en projectleiders worden geladen.
      case: caseData,
      projectleider,
      teamleden
    });
});

app.get('/contact', (request, response) => {
  response.render('contact.liquid');
});

// 404 pagina live zetten
app.get('/404', (request, response) => {
  response.render('404.liquid');
});

app.use((request, response) => {
  response.status(404).render('404.liquid');
});

// Port live zetten 
app.set('port', process.env.PORT || 8888);
app.listen(app.get('port'), () => {
  console.log(`App running on http://localhost:${app.get('port')}`);
});