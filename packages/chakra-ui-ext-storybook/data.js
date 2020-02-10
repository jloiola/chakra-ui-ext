import { Info } from 'luxon';

export const fetchJediOrSith = (search='') => {
  return fetch(`https://swapi.co/api/people/?search=${search}`)
    .then(res => res.json())
    .then(({results}) => results)
    .catch(err => console.error(err))
};

export const fetchRick = (search='') => {
  return fetch(`https://rickandmortyapi.com/api/character/?name=${search}`)
    .then(res => res.json())
    .then(({results, error}) => error ? [] : results)
    .catch(err => console.error(err));
};

export const dogData = [
  "American Cocker Spaniel", "American Water Spaniel", "Blue Picardy Spaniel",
  "Boykin Spaniel", "Cavalier King Charles Spaniel", "Clumber Spaniel", "Drentse Patrijshond",
  "English Cocker Spaniel", "English Springer Spaniel", "Field Spaniel", "German Spaniel",
  "Irish Water Spaniel", "King Charles Spaniel", "Kooikerhondje", "Markiesje", "Papillon", 
  "Phalène", "Picardy Spaniel", "Pont-Audemer Spaniel", "Russian Spaniel", "Stabyhoun",
  "Sussex Spaniel", "Welsh Springer Spaniel", "Alpine Spaniel", "English Water Spaniel",
  "Norfolk Spaniel", "Toy Trawler Spaniel", "Tweed Water Spaniel", "Japanese Chin", "Pekingese",
  "Tibetan Spaniel",
];

export const years = () => {
  const options = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 90; i--) {
    options.push(i);
  }
  return options;
};

export const months = Info.months('short').map((month, i) => (
  {value: parseInt(Info.months('numeric')[i]), text: month}
));
