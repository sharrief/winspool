import prisma from "@/db/prisma";

const draft2020 = new Map<number, string[]>();
draft2020.set(1,['nuggets','raptors','hawks','grizzlies']);
draft2020.set(2,['nets','jazz','pelicans','magic']);
draft2020.set(3,['celtics','heat','trail blazers','wizards']);
draft2020.set(4,['clippers','mavericks','rockets','kings']);
draft2020.set(5,['bucks','warriors','suns','bulls']);
draft2020.set(6,['lakers','76ers','pacers','spurs']);

const draft2021 = new Map<number, string[]>();
draft2021.set(1,['lakers','trail blazers','celtics','thunder']);
draft2021.set(2,['nets','warriors','bulls','timberwolves']);
draft2021.set(3,['jazz','hawks','knicks','wizards']);
draft2021.set(4,['76ers','clippers','kings','grizzlies']);
draft2021.set(5,['bucks','mavericks','nuggets','raptors']);
draft2021.set(6,['suns','heat','pacers','hornets']);

async function loadLeagueData() {
  for (const [ownerId, teams] of draft2020) {
    const connectTeams = teams.map((name) => ({ name: name.split(' ').map((w) => w.charAt(0).toUpperCase() + w.substring(1)).join(' ') }));
    await prisma.seasonDraft.create({
      data: {
        season: 2020,
        ownerId,
        teams: { 
          connect: connectTeams
        }
      }
    })
  }
  for (const [ownerId, teams] of draft2021) {
    const connectTeams = teams.map((name) => ({ name: name.split(' ').map((w) => w.charAt(0).toUpperCase() + w.substring(1)).join(' ') }));
    await prisma.seasonDraft.create({
      data: {
        season: 2021,
        ownerId,
        teams: { 
          connect: connectTeams
        }
      }
    })
  }
}

loadLeagueData();