import loadLeagueData from './load.leagueData';
import loadTeamsIntoDB from './load.teams';
import loadSeasonIntoDB from './load.season';
import bootstrapStats from './bootstrapStats';

loadLeagueData();
loadTeamsIntoDB();
loadSeasonIntoDB(2020);
loadSeasonIntoDB(2021);
loadSeasonIntoDB(2023);
bootstrapStats();
