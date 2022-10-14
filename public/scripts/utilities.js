/*** notes on code structure ****************************************
 * 
 * seperate functionality for pagination and filters
 * 
 * have cookie functions in utilities file
 * 
 * filters+search select events - events list passed to pagination function
 * - pagination function presents events and computes number of pages
 * 
 * pagination function must create prev/next/number buttons on demand
 * 
 * number of events (n), maximum number of events per page (e),
 * resulting number of pages (p)
 * 
 * p = ceil(n / e)
 * 
 * 
 * showing events based on page number:
 * 
 * 1 ->  1-6
 * 2 ->  7-12
 * 3 -> 13-18 
 *
********************************************************************/

/********************************************************************
 * CONSTANTS
********************************************************************/

const RESULTS_WRAPPER = document.querySelector('#page-content');

const SEARCH_INDICATOR = document.querySelector('#search-indicator');
const FILTER_INDICATOR = document.querySelector('#multi-filter-indicator');
const RESULT_NUM_INDICATOR = document.querySelector('#result-number-indicator');

const PAGE_LINKS = document.querySelector('#libraries-pagination-list');
const MAX_EVENTS_PER_PAGE = 6;

// for pagination testing
const ALL_EVENTS = document.querySelectorAll('.single-event-container');

/********************************************************************
 * UTILITIES
********************************************************************/

let currentPage = 1;
let numberOfPages = 1;

window.onload = function() {
  console.log('test');
  calculatePageCount();

  displayEvents(ALL_EVENTS, currentPage);
  updatePageLinks();
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = 'expires='+ d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

/********************************************************************
 * FILTERING
********************************************************************/



/********************************************************************
 * PAGINATION
********************************************************************/

const calculatePageCount = function() {
  const events = RESULTS_WRAPPER.children.length;
  console.log(`number of results= ${events}`);
  const numPages = Math.ceil(events / MAX_EVENTS_PER_PAGE);
  console.log(`number of pages= ${numPages}`);

  numberOfPages = numPages;

  generatePageLinks(numberOfPages);
}

// Determines which results to display based on page number
// Any number greater than 0 valid
const displayEvents = function(events, page) {
  console.log(events);
  for (i = 0; i < events.length; i++) {
    events[i].style.display = 'none';
    if (i >= (MAX_EVENTS_PER_PAGE * (page - 1)) && i < MAX_EVENTS_PER_PAGE * page) {
      events[i].style.display = 'block';
    }
  }
}

// Takes the relevant number, returns the final element markup for a single link
const generateLink = function(n) {
  const newLink = document.createElement('li');
  newLink.id = `page-${n}-link`;
  newLink.classList.add('page-item');
  newLink.innerHTML = `<button class="page-link" onclick="showPage(${n})">${n}</button>`;
  return newLink;
}

// Iteratively generate the given number of page links
const generatePageLinks = function(pageNum) {

  if (pageNum < 2) return;

  PAGE_LINKS.insertAdjacentHTML('beforeend',
  `<li id="page-prev-link" class="page-item disabled">
    <button class="page-link" onclick="prevPage()" tabindex="-1">Previous</button>
  </li>`);

  for (i = 1; i <= pageNum; i++) {
    PAGE_LINKS.appendChild(generateLink(i));
  }

  PAGE_LINKS.insertAdjacentHTML('beforeend',
  `<li id="page-next-link" class="page-item">
    <button class="page-link" onclick="nextPage()">Next</button>
  </li>`);
}

const nextPage = function() {
  currentPage++;
  displayEvents(ALL_EVENTS, currentPage);
  updatePageLinks();
}

const prevPage = function() {
  currentPage--;
  displayEvents(ALL_EVENTS, currentPage);
  updatePageLinks();
}

const gotoPage = function(p) {
  
}

const updatePageLinks = function() {
  const prevLink = document.querySelector('#page-prev-link');
  const nextLink = document.querySelector('#page-next-link');
  const currentLink = document.querySelector(`#page-${currentPage}-link`);
  const allLinks = document.querySelectorAll('.page-item');

  if (currentPage === 1) {
    prevLink.classList.add("disabled");
    prevLink.firstElementChild.tabIndex="-1";
    document.activeElement.blur();
  } else {
    prevLink.classList.remove("disabled");
    prevLink.firstElementChild.tabIndex="0";
  }
  if (currentPage === numberOfPages) {
    nextLink.classList.add("disabled");
    nextLink.firstElementChild.tabIndex="-1";
    document.activeElement.blur();
  } else {
    nextLink.classList.remove("disabled");
    nextLink.firstElementChild.tabIndex="0";
  }

  allLinks.forEach(l => l.classList.remove('active'));
  currentLink.classList.add('active');
}