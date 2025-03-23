import { getRandomInt } from './getRandomInt';

const randomNames = [
  'Aliaksandr', 'Dmitry', 'Natallia', 'Siarhei', 'Volha', 'Mikola', 'Ihar', 'Paval',
  'Sviatlana', 'Yauhen', 'Hanna', 'Uladzimir', 'Alena', 'Zmitser', 'Ryhor', 'Nadzeya',
  'Vasili', 'Maryna', 'Yury', 'Kseniya', 'Anatol', 'Viktar', 'Iryna', 'Leonid', 'Tatsiana',
  'Andriy', 'Oksana', 'Bohdan', 'Yulia', 'Taras', 'Larysa', 'Mykola', 'Svitlana',
  'Oleksandr', 'Iryna', 'Petro', 'Natalia', 'Vasyl', 'Olha', 'Dmytro', 'Lesia',
  'Volodymyr', 'Kateryna', 'Stepan', 'Tetiana', 'Yevhen', 'Halyna', 'Serhiy', 'Mariia', 'Roman',
  'Nikola', 'Jovana', 'Miloš', 'Ana', 'Stefan', 'Dragana', 'Marko', 'Ivana',
  'Vuk', 'Milica', 'Aleksandar', 'Nevena', 'Filip', 'Tamara', 'Bogdan', 'Lena',
  'Lazar', 'Teodora', 'Nemanja', 'Sara', 'Uroš', 'Katarina', 'Dejan', 'Marija', 'Dušan',
  'Jakub', 'Zuzanna', 'Mateusz', 'Katarzyna', 'Bartosz', 'Agnieszka', 'Piotr', 'Anna',
  'Michał', 'Magdalena', 'Tomasz', 'Aleksandra', 'Marcin', 'Joanna', 'Paweł', 'Monika',
  'Krzysztof', 'Ewa', 'Adam', 'Dorota', 'Łukasz', 'Natalia', 'Rafał', 'Sylwia', 'Szymon',
  'Jaan', 'Kadri', 'Siim', 'Maarja', 'Tõnu', 'Kristiina', 'Mait', 'Anu',
  'Toomas', 'Eve', 'Kristjan', 'Marika', 'Priit', 'Lea', 'Indrek', 'Pille',
  'Raivo', 'Tiina', 'Margus', 'Liis', 'Arvo', 'Sirje', 'Peeter', 'Kaia', 'Vallo'
];

export function getRndName() {
  return randomNames[getRandomInt(0, randomNames.length)];
}
