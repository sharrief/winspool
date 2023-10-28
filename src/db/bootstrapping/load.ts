import loadLeagueData from "./load.leagueData";
import loadTeamsIntoDB from "./load.teams";
import loadGamesIntoDB from "./load.games";
import aggregateTeamSeasonStats from "./aggregateTeamSeasonStats";

loadLeagueData();
loadTeamsIntoDB();
loadGamesIntoDB();
aggregateTeamSeasonStats();
