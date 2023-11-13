import { StaticImageData } from 'next/image';
import lakersLogo from '../../public/images/lakers.png';
import blazersLogo from '../../public/images/trail_blazers.png';
import cavaliersLogo from '../../public/images/cavaliers.png';
import magicLogo from '../../public/images/magic.png';
import thunderLogo from '../../public/images/thunder.png';
import sixersLogo from '../../public/images/76ers.png';
import netsLogo from '../../public/images/nets.png';
import spursLogo from '../../public/images/spurs.png';
import hornetsLogo from '../../public/images/hornets.png';
import knicksLogo from '../../public/images/knicks.png';
import kingsLogo from '../../public/images/kings.png';
import clippersLogo from '../../public/images/clippers.png';
import raptorsLogo from '../../public/images/raptors.png';
import mavericksLogo from '../../public/images/mavericks.png';
import timberwolvesLogo from '../../public/images/timberwolves.png';
import nuggetsLogo from '../../public/images/nuggets.png';
import jazzLogo from '../../public/images/jazz.png';
import pelicansLogo from '../../public/images/pelicans.png';
import sunsLogo from '../../public/images/suns.png';
import bullsLogo from '../../public/images/bulls.png';
import wizardsLogo from '../../public/images/wizards.png';
import grizzliesLogo from '../../public/images/grizzlies.png';
import bucksLogo from '../../public/images/bucks.png';
import warriorsLogo from '../../public/images/warriors.png';
import heatLogo from '../../public/images/heat.png';
import pistonsLogo from '../../public/images/pistons.png';
import rocketsLogo from '../../public/images/rockets.png';
import celticsLogo from '../../public/images/celtics.png';
import pacersLogo from '../../public/images/pacers.png';
import hawksLogo from '../../public/images/hawks.png';

export type TeamTheme = {
  primaryColor: string;
  secondaryColor: string;
  primaryText: string;
  secondaryText: string;
};
export type TeamName =
  'Lakers' |
  'Trail Blazers' |
  'Cavaliers' |
  'Magic' |
  'Thunder' |
  '76ers' |
  'Nets' |
  'Spurs' |
  'Hornets' |
  'Knicks' |
  'Kings' |
  'Clippers' |
  'Raptors' |
  'Mavericks' |
  'Timberwolves' |
  'Nuggets' |
  'Jazz' |
  'Pelicans' |
  'Suns' |
  'Bulls' |
  'Wizards' |
  'Grizzlies' |
  'Bucks' |
  'Warriors' |
  'Heat' |
  'Pistons' |
  'Rockets' |
  'Celtics' |
  'Pacers' |
  'Hawks';

// Custom types
export type Team = {
  id: number
  abbreviation: string
  city: string
  conference: string
  division: string
  fullName: string
  name: TeamName
};

const teamMeta = new Map<number, Team & TeamTheme & { logo: StaticImageData }>([
  [1, {
    id: 1,
    abbreviation: 'ATL',
    city: 'Atlanta',
    conference: 'East',
    division: 'Southeast',
    fullName: 'Atlanta Hawks',
    name: 'Hawks',
    primaryColor: 'rgb(205,7,47)',
    secondaryColor: 'white',
    primaryText: 'white',
    secondaryText: 'black',
    logo: hawksLogo,
  }],
  [2, {
    id: 2,
    abbreviation: 'BOS',
    city: 'Boston',
    conference: 'East',
    division: 'Atlantic',
    fullName: 'Boston Celtics',
    name: 'Celtics',
    primaryColor: 'rgb(0,122,48)',
    secondaryColor: 'rgb(140,111,76)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: celticsLogo,
  }],
  [3, {
    id: 3,
    abbreviation: 'BKN',
    city: 'Brooklyn',
    conference: 'East',
    division: 'Atlantic',
    fullName: 'Brooklyn Nets',
    name: 'Nets',
    primaryColor: 'white',
    secondaryColor: 'rgb(45,41,38)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: netsLogo,
  }],
  [4, {
    id: 4,
    abbreviation: 'CHA',
    city: 'Charlotte',
    conference: 'East',
    division: 'Southeast',
    fullName: 'Charlotte Hornets',
    name: 'Hornets',
    primaryColor: 'rgb(28, 15, 95)',
    secondaryColor: 'rgb(1, 139, 167)',
    primaryText: 'white',
    secondaryText: 'black',
    logo: hornetsLogo,
  }],
  [5, {
    id: 5,
    abbreviation: 'CHI',
    city: 'Chicago',
    conference: 'East',
    division: 'Central',
    fullName: 'Chicago Bulls',
    name: 'Bulls',
    secondaryColor: 'rgb(188,3,43)',
    primaryColor: 'white',
    primaryText: 'black',
    secondaryText: 'white',
    logo: bullsLogo,
  }],
  [6, {
    id: 6,
    abbreviation: 'CLE',
    city: 'Cleveland',
    conference: 'East',
    division: 'Central',
    fullName: 'Cleveland Cavaliers',
    name: 'Cavaliers',
    primaryColor: 'rgb(97,16,46)',
    secondaryColor: 'rgb(212,167,61)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: cavaliersLogo,
  }],
  [7, {
    id: 7,
    abbreviation: 'DAL',
    city: 'Dallas',
    conference: 'West',
    division: 'Southwest',
    fullName: 'Dallas Mavericks',
    name: 'Mavericks',
    primaryColor: 'rgb(142,144,147)',
    secondaryColor: 'rgb(23,81,179)',
    primaryText: 'black',
    secondaryText: 'white',
    logo: mavericksLogo,
  }],
  [8, {
    id: 8,
    abbreviation: 'DEN',
    city: 'Denver',
    conference: 'West',
    division: 'Northwest',
    fullName: 'Denver Nuggets',
    name: 'Nuggets',
    primaryColor: 'rgb(13,33,62)',
    secondaryColor: 'rgb(255,198,39)',
    primaryText: 'white',
    secondaryText: 'black',
    logo: nuggetsLogo,
  }],
  [9, {
    id: 9,
    abbreviation: 'DET',
    city: 'Detroit',
    conference: 'East',
    division: 'Central',
    fullName: 'Detroit Pistons',
    name: 'Pistons',
    primaryColor: 'rgb(215,8,59)',
    secondaryColor: 'rgb(1,70,174)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: pistonsLogo,
  }],
  [10, {
    id: 10,
    abbreviation: 'GSW',
    city: 'Golden State',
    conference: 'West',
    division: 'Pacific',
    fullName: 'Golden State Warriors',
    name: 'Warriors',
    primaryColor: 'white',
    // primaryColor: 'rgb(29,66,138)',
    secondaryColor: 'rgb(252,186,39)',
    primaryText: 'white',
    secondaryText: 'black',
    logo: warriorsLogo,
  }],
  [11, {
    id: 11,
    abbreviation: 'HOU',
    city: 'Houston',
    conference: 'West',
    division: 'Southwest',
    fullName: 'Houston Rockets',
    name: 'Rockets',
    primaryColor: 'white',
    // primaryColor: 'rgb(57,58,52)',
    secondaryColor: 'rgb(200,29,43)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: rocketsLogo,
  }],
  [12, {
    id: 12,
    abbreviation: 'IND',
    city: 'Indiana',
    conference: 'East',
    division: 'Central',
    fullName: 'Indiana Pacers',
    name: 'Pacers',
    primaryColor: 'rgb(253,186,49)',
    secondaryColor: 'rgb(0,45,97)',
    primaryText: 'black',
    secondaryText: 'white',
    logo: pacersLogo,
  }],
  [13, {
    id: 13,
    abbreviation: 'LAC',
    city: 'LA',
    conference: 'West',
    division: 'Pacific',
    fullName: 'LA Clippers',
    name: 'Clippers',
    // primaryColor: 'rgb(1,70,174)',
    primaryColor: 'white',
    secondaryColor: 'rgb(215,8,59)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: clippersLogo,
  }],
  [14, {
    id: 14,
    abbreviation: 'LAL',
    city: 'Los Angeles',
    conference: 'West',
    division: 'Pacific',
    fullName: 'Los Angeles Lakers',
    name: 'Lakers',
    primaryColor: 'white',
    // primaryColor: 'rgb(251,177,54)',
    secondaryColor: 'rgb(84,46,132)',
    primaryText: 'black',
    secondaryText: 'white',
    logo: lakersLogo,
  }],
  [15, {
    id: 15,
    abbreviation: 'MEM',
    city: 'Memphis',
    conference: 'West',
    division: 'Southwest',
    fullName: 'Memphis Grizzlies',
    name: 'Grizzlies',
    primaryColor: 'white',
    // primaryColor: 'rgb(124,155,193)',
    secondaryColor: 'rgb(12,35,64)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: grizzliesLogo,
  }],
  [16, {
    id: 16,
    abbreviation: 'MIA',
    city: 'Miami',
    conference: 'East',
    division: 'Southeast',
    fullName: 'Miami Heat',
    name: 'Heat',
    primaryColor: 'white',
    // primaryColor: 'rgb(152,1,46)',
    secondaryColor: 'rgb(249,161,26)',
    primaryText: 'white',
    secondaryText: 'black',
    logo: heatLogo,
  }],
  [17, {
    id: 17,
    abbreviation: 'MIL',
    city: 'Milwaukee',
    conference: 'East',
    division: 'Central',
    fullName: 'Milwaukee Bucks',
    name: 'Bucks',
    primaryColor: 'rgb(40,78,55)',
    secondaryColor: 'rgb(223,211,176)',
    primaryText: 'white',
    secondaryText: 'black',
    logo: bucksLogo,
  }],
  [18, {
    id: 18,
    abbreviation: 'MIN',
    city: 'Minnesota',
    conference: 'West',
    division: 'Northwest',
    fullName: 'Minnesota Timberwolves',
    name: 'Timberwolves',
    primaryColor: 'rgb(0,43,92)',
    secondaryColor: 'rgb(121,193,66)',
    primaryText: 'white',
    secondaryText: 'black',
    logo: timberwolvesLogo,
  }],
  [19, {
    id: 19,
    abbreviation: 'NOP',
    city: 'New Orleans',
    conference: 'West',
    division: 'Southwest',
    fullName: 'New Orleans Pelicans',
    name: 'Pelicans',
    primaryColor: 'rgb(7,30,62)',
    secondaryColor: 'rgb(186,152,90)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: pelicansLogo,
  }],
  [20, {
    id: 20,
    abbreviation: 'NYK',
    city: 'New York',
    conference: 'East',
    division: 'Atlantic',
    fullName: 'New York Knicks',
    name: 'Knicks',
    primaryColor: 'rgb(245, 132, 38)',
    secondaryColor: 'rgb(0, 107, 182)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: knicksLogo,
  }],
  [21, {
    id: 21,
    abbreviation: 'OKC',
    city: 'Oklahoma City',
    conference: 'West',
    division: 'Northwest',
    fullName: 'Oklahoma City Thunder',
    name: 'Thunder',
    primaryColor: 'rgb(1,114,207)',
    secondaryColor: 'rgb(241,40,56)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: thunderLogo,
  }],
  [22, {
    id: 22,
    abbreviation: 'ORL',
    city: 'Orlando',
    conference: 'East',
    division: 'Southeast',
    fullName: 'Orlando Magic',
    name: 'Magic',
    primaryColor: 'rgb(5,118,188)',
    secondaryColor: 'rgb(12,30,36)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: magicLogo,
  }],
  [23, {
    id: 23,
    abbreviation: 'PHI',
    city: 'Philadelphia',
    conference: 'East',
    division: 'Atlantic',
    fullName: 'Philadelphia 76ers',
    name: '76ers',
    primaryColor: 'rgb(0,61,165)',
    secondaryColor: 'rgb(213,0,50)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: sixersLogo,
  }],
  [24, {
    id: 24,
    abbreviation: 'PHX',
    city: 'Phoenix',
    conference: 'West',
    division: 'Pacific',
    fullName: 'Phoenix Suns',
    name: 'Suns',
    primaryColor: 'rgb(26,19,83)',
    secondaryColor: 'rgb(250,162,33)',
    primaryText: 'white',
    secondaryText: 'black',
    logo: sunsLogo,
  }],
  [25, {
    id: 25,
    abbreviation: 'POR',
    city: 'Portland',
    conference: 'West',
    division: 'Northwest',
    fullName: 'Portland Trail Blazers',
    name: 'Trail Blazers',
    primaryColor: 'white',
    secondaryColor: 'rgb(226,57,63)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: blazersLogo,
  }],
  [26, {
    id: 26,
    abbreviation: 'SAC',
    city: 'Sacramento',
    conference: 'West',
    division: 'Pacific',
    fullName: 'Sacramento Kings',
    name: 'Kings',
    primaryColor: 'white',
    // primaryColor: 'rgb(95,106,114)',
    secondaryColor: 'rgb(80,45,127)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: kingsLogo,
  }],
  [27, {
    id: 27,
    abbreviation: 'SAS',
    city: 'San Antonio',
    conference: 'West',
    division: 'Southwest',
    fullName: 'San Antonio Spurs',
    name: 'Spurs',
    primaryColor: 'white',
    secondaryColor: 'rgb(46,41,36)',
    // secondaryColor: 'rgb(141,142,142)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: spursLogo,
  }],
  [28, {
    id: 28,
    abbreviation: 'TOR',
    city: 'Toronto',
    conference: 'East',
    division: 'Atlantic',
    fullName: 'Toronto Raptors',
    name: 'Raptors',
    primaryColor: 'rgb(43,39,35)',
    secondaryColor: 'rgb(190,16,52)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: raptorsLogo,
  }],
  [29, {
    id: 29,
    abbreviation: 'UTA',
    city: 'Utah',
    conference: 'West',
    division: 'Northwest',
    fullName: 'Utah Jazz',
    name: 'Jazz',
    primaryColor: 'white',
    // primaryColor: 'rgb(0,33,68)',
    secondaryColor: 'rgb(40,78,55)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: jazzLogo,
  }],
  [30, {
    id: 30,
    abbreviation: 'WAS',
    city: 'Washington',
    conference: 'East',
    division: 'Southeast',
    fullName: 'Washington Wizards',
    name: 'Wizards',
    primaryColor: 'rgb(203,8,48)',
    secondaryColor: 'rgb(0,33,67)',
    primaryText: 'white',
    secondaryText: 'white',
    logo: wizardsLogo,
  }],
]);

export default function getTeamMeta(id: number) {
  if (id >= 1 && id <= 30) { return teamMeta.get(id)!; }
  throw new Error('Invalid team id provided to getTeamMeta');
}
