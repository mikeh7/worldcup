// Famous footballer surnames mapped to the country whose kit they'll wear.
// Surnames are unique; every country here has a matching entry in kits.ts.
export interface Footballer {
  surname: string;
  country: string;
}

export const FOOTBALLERS: Footballer[] = [
  // Argentina
  { surname: "Messi", country: "Argentina" },
  { surname: "Maradona", country: "Argentina" },
  { surname: "Di Maria", country: "Argentina" },
  { surname: "Aguero", country: "Argentina" },
  { surname: "Batistuta", country: "Argentina" },
  // Brazil
  { surname: "Ronaldo", country: "Brazil" },
  { surname: "Ronaldinho", country: "Brazil" },
  { surname: "Pele", country: "Brazil" },
  { surname: "Neymar", country: "Brazil" },
  { surname: "Kaka", country: "Brazil" },
  { surname: "Vinicius", country: "Brazil" },
  // Portugal
  { surname: "Figo", country: "Portugal" },
  { surname: "Eusebio", country: "Portugal" },
  { surname: "Felix", country: "Portugal" },
  // France
  { surname: "Zidane", country: "France" },
  { surname: "Mbappe", country: "France" },
  { surname: "Henry", country: "France" },
  { surname: "Platini", country: "France" },
  { surname: "Griezmann", country: "France" },
  { surname: "Pogba", country: "France" },
  // England
  { surname: "Kane", country: "England" },
  { surname: "Beckham", country: "England" },
  { surname: "Rooney", country: "England" },
  { surname: "Gerrard", country: "England" },
  { surname: "Shearer", country: "England" },
  { surname: "Bellingham", country: "England" },
  // Spain
  { surname: "Iniesta", country: "Spain" },
  { surname: "Xavi", country: "Spain" },
  { surname: "Ramos", country: "Spain" },
  { surname: "Torres", country: "Spain" },
  { surname: "Raul", country: "Spain" },
  // Germany
  { surname: "Muller", country: "Germany" },
  { surname: "Klose", country: "Germany" },
  { surname: "Kroos", country: "Germany" },
  { surname: "Neuer", country: "Germany" },
  { surname: "Beckenbauer", country: "Germany" },
  // Netherlands
  { surname: "Cruyff", country: "Netherlands" },
  { surname: "Van Basten", country: "Netherlands" },
  { surname: "Robben", country: "Netherlands" },
  { surname: "Bergkamp", country: "Netherlands" },
  { surname: "Van Dijk", country: "Netherlands" },
  // Belgium
  { surname: "Hazard", country: "Belgium" },
  { surname: "De Bruyne", country: "Belgium" },
  { surname: "Lukaku", country: "Belgium" },
  // Italy
  { surname: "Totti", country: "Italy" },
  { surname: "Pirlo", country: "Italy" },
  { surname: "Baggio", country: "Italy" },
  { surname: "Buffon", country: "Italy" },
  { surname: "Maldini", country: "Italy" },
  // Uruguay
  { surname: "Suarez", country: "Uruguay" },
  { surname: "Cavani", country: "Uruguay" },
  { surname: "Forlan", country: "Uruguay" },
  // Croatia
  { surname: "Modric", country: "Croatia" },
  { surname: "Suker", country: "Croatia" },
  // Others
  { surname: "Lewandowski", country: "Poland" },
  { surname: "Salah", country: "Egypt" },
  { surname: "Haaland", country: "Norway" },
  { surname: "Ibrahimovic", country: "Sweden" },
  { surname: "Bale", country: "Wales" },
  { surname: "James", country: "Colombia" },
  { surname: "Mane", country: "Senegal" },
  { surname: "Hernandez", country: "Mexico" },
];
