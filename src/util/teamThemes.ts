export type TeamName = keyof typeof teamThemes;
export type TeamTheme = {
  primaryColor: string;
  secondaryColor: string;
  primaryText: string;
  secondaryText: string;
}
const teamThemes = {
  lakers: {
    primaryColor: 'white',
    // primaryColor: 'rgb(251,177,54)',
    secondaryColor: 'rgb(84,46,132)',
    primaryText: 'black',
    secondaryText: 'white',

  },
  trail_blazers: {
    // primaryColor: 'rgb(7,25,33)',
    primaryColor: 'white',
    secondaryColor: 'rgb(226,57,63)',
    primaryText: 'white',
    secondaryText: 'white',

  },
  cavaliers: {
    primaryColor: 'rgb(97,16,46)',
    secondaryColor: 'rgb(212,167,61)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  magic: {
    primaryColor: 'rgb(5,118,188)',
    secondaryColor: 'rgb(12,30,36)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  thunder: {
    primaryColor: 'rgb(1,114,207)',
    secondaryColor: 'rgb(241,40,56)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  '76ers': {
    primaryColor: 'rgb(0,61,165)',
    secondaryColor: 'rgb(213,0,50)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  nets: {
    primaryColor: 'white',
    secondaryColor: 'rgb(45,41,38)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  spurs: {
    primaryColor: 'white', 
    secondaryColor: 'rgb(46,41,36)',
    // secondaryColor: 'rgb(141,142,142)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  hornets: {
    primaryColor: 'rgb(28, 15, 95)',
    secondaryColor: 'rgb(1, 139, 167)',
    primaryText: 'white',
    secondaryText: 'black',
  },
  knicks: {
    primaryColor: 'rgb(245, 132, 38)',
    secondaryColor: 'rgb(0, 107, 182)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  kings: {
    primaryColor: 'white',
    // primaryColor: 'rgb(95,106,114)',
    secondaryColor: 'rgb(80,45,127)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  clippers: {
    // primaryColor: 'rgb(1,70,174)',
    primaryColor: 'white',
    secondaryColor: 'rgb(215,8,59)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  raptors: {
    primaryColor: 'rgb(43,39,35)',
    secondaryColor: 'rgb(190,16,52)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  mavericks: {
    primaryColor: 'rgb(142,144,147)',
    secondaryColor: 'rgb(23,81,179)',
    primaryText: 'black',
    secondaryText: 'white',
  },
  timberwolves: {
    primaryColor: 'rgb(0,43,92)',
    secondaryColor: 'rgb(121,193,66)',
    primaryText: 'white',
    secondaryText: 'black',
  },
  nuggets: {
    primaryColor: 'rgb(13,33,62)',
    secondaryColor: 'rgb(255,198,39)',
    primaryText: 'white',
    secondaryText: 'black',
  },
  jazz: {
    primaryColor: 'white',
    // primaryColor: 'rgb(0,33,68)',
    secondaryColor: 'rgb(40,78,55)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  pelicans: {
    primaryColor: 'rgb(7,30,62)',
    secondaryColor: 'rgb(186,152,90)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  suns: {
    primaryColor: 'rgb(26,19,83)',
    secondaryColor: 'rgb(250,162,33)',
    primaryText: 'white',
    secondaryText: 'black',
  },
  bulls: {
    secondaryColor: 'rgb(188,3,43)',
    primaryColor: 'white',
    primaryText: 'black',
    secondaryText: 'white',
  },
  wizards: {
    primaryColor: 'rgb(203,8,48)',
    secondaryColor: 'rgb(0,33,67)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  grizzlies: {
    primaryColor: 'white',
    // primaryColor: 'rgb(124,155,193)',
    secondaryColor: 'rgb(12,35,64)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  bucks: {
    primaryColor: 'rgb(40,78,55)',
    secondaryColor: 'rgb(223,211,176)',
    primaryText: 'white',
    secondaryText: 'black',
  },
  warriors: {
    primaryColor: 'white',
    // primaryColor: 'rgb(29,66,138)',
    secondaryColor: 'rgb(252,186,39)',
    primaryText: 'white',
    secondaryText: 'black',
  },
  heat: {
    primaryColor: 'white',
    // primaryColor: 'rgb(152,1,46)',
    secondaryColor: 'rgb(249,161,26)',
    primaryText: 'white',
    secondaryText: 'black',
  },
  pistons: {
    primaryColor: 'rgb(215,8,59)',
    secondaryColor: 'rgb(1,70,174)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  rockets: {
    primaryColor: 'white',
    // primaryColor: 'rgb(57,58,52)',
    secondaryColor: 'rgb(200,29,43)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  celtics: {
    primaryColor: 'rgb(0,122,48)',
    secondaryColor: 'rgb(140,111,76)',
    primaryText: 'white',
    secondaryText: 'white',
  },
  pacers: {
    primaryColor: 'rgb(253,186,49)',
    secondaryColor: 'rgb(0,45,97)',
    primaryText: 'black',
    secondaryText: 'white',
  },
  hawks: {
    primaryColor: 'rgb(205,7,47)',
    secondaryColor: 'white',
    primaryText: 'white',
    secondaryText: 'black',
  },
};

export default teamThemes;
