import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";

const App = () => {
  const [teams, setTeams] = useState([
    { name: "CHS-A", players: [{ name: "Alice", rating: 1200, wins: 0 }, { name: "Bob", rating: 1300, wins: 0 }, { name: "Carol", rating: 1250, wins: 0 }, { name: "Dan", rating: 1220, wins: 0 }], points: 0 },
    { name: "CHS-B", players: [{ name: "Ellen", rating: 1190, wins: 0 }, { name: "Frank", rating: 1280, wins: 0 }, { name: "Grace", rating: 1240, wins: 0 }, { name: "Hank", rating: 1210, wins: 0 }], points: 0 },
    { name: "LHS-A", players: [{ name: "Isaac", rating: 1320, wins: 0 }, { name: "Julia", rating: 1350, wins: 0 }, { name: "Kevin", rating: 1290, wins: 0 }, { name: "Lisa", rating: 1310, wins: 0 }], points: 0 },
    { name: "LHS-B", players: [{ name: "Mike", rating: 1260, wins: 0 }, { name: "Nancy", rating: 1230, wins: 0 }, { name: "Oscar", rating: 1270, wins: 0 }, { name: "Pam", rating: 1240, wins: 0 }], points: 0 },
    { name: "BHMS-A", players: [{ name: "Quinn", rating: 1330, wins: 0 }, { name: "Rachel", rating: 1290, wins: 0 }, { name: "Steve", rating: 1340, wins: 0 }, { name: "Tina", rating: 1300, wins: 0 }], points: 0 },
    { name: "BHMS-B", players: [{ name: "Ursula", rating: 1230, wins: 0 }, { name: "Victor", rating: 1270, wins: 0 }, { name: "Wendy", rating: 1220, wins: 0 }, { name: "Xavier", rating: 1250, wins: 0 }], points: 0 },
    { name: "THS-A", players: [{ name: "Yasmin", rating: 1310, wins: 0 }, { name: "Zack", rating: 1360, wins: 0 }, { name: "Amy", rating: 1280, wins: 0 }, { name: "Ben", rating: 1320, wins: 0 }], points: 0 }
  ]);

  const [matches, setMatches] = useState([]);
  const [rounds, setRounds] = useState([]);

  const determineMatchWinner = (match) => {
    let team1Wins = match.playerMatches.filter(pm => pm.result === pm.player1).length;
    let team2Wins = match.playerMatches.filter(pm => pm.result === pm.player2).length;
    return team1Wins > team2Wins ? match.team1 : team2Wins > team1Wins ? match.team2 : "draw";
  };

  const recordPlayerMatchResult = (matchId, playerMatchIndex, winner) => {
    let newMatches = [...matches];
    let match = newMatches[matchId];
    let playerMatch = match.playerMatches[playerMatchIndex];

    playerMatch.result = winner;
    match.result = determineMatchWinner(match);

    let updatedTeams = [...teams];
    let team1 = updatedTeams.find(t => t.name === match.team1);
    let team2 = updatedTeams.find(t => t.name === match.team2);

    if (winner === "draw") {
      team1.players.find(p => p.name === playerMatch.player1).wins += 0.5;
      team2.players.find(p => p.name === playerMatch.player2).wins += 0.5;
    } else {
      let winningTeam = team1.players.find(p => p.name === winner) ? team1 : team2;
      winningTeam.players.find(p => p.name === winner).wins += 1;
    }

    setMatches(newMatches);
    setTeams(updatedTeams);
  };

  const Submit = (match) => {
    let updatedTeams = [...teams];

    let team1 = updatedTeams.find(team => team.name === match.team1);
    let team2 = updatedTeams.find(team => team.name === match.team2);

    if (match.result === match.team1) {
      team1.points += 2;
    } else if (match.result === match.team2) {
      team2.points += 2;
    } else {
      team1.points += 1;
      team2.points += 1;
    }

    setTeams(updatedTeams);
  };

  const generatePlayerMatches = (players1, players2) => {
    let sorted1 = [...players1].sort((a, b) => b.rating - a.rating);
    let sorted2 = [...players2].sort((a, b) => b.rating - a.rating);
    return sorted1.map((player, index) => ({
      player1: player.name,
      player2: sorted2[index] ? sorted2[index].name : "Bye",
      result: null
    }));
  };

  const generateRounds = () => {
    let shuffledTeams = [...teams];
    if (shuffledTeams.length % 2 !== 0) shuffledTeams.push({ name: "BYE", players: [], points: 0 });

    let numRounds = shuffledTeams.length - 1;
    let matchRounds = [];
    let allMatches = [];

    for (let round = 0; round < numRounds; round++) {
      let roundMatches = [];
      for (let i = 0; i < shuffledTeams.length / 2; i++) {
        let team1 = shuffledTeams[i];
        let team2 = shuffledTeams[shuffledTeams.length - 1 - i];
        if (team1.name !== "BYE" && team2.name !== "BYE") {
          let match = {
            id: allMatches.length,
            team1: team1.name,
            team2: team2.name,
            players1: team1.players,
            players2: team2.players,
            result: null,
            playerMatches: generatePlayerMatches(team1.players, team2.players)
          };
          roundMatches.push(match);
          allMatches.push(match);
        }
      }
      matchRounds.push(roundMatches);
      shuffledTeams.splice(1, 0, shuffledTeams.pop());
    }

    setRounds(matchRounds);
    setMatches(allMatches);
  };

  const determineTiebreaker = (team1, team2) => {
    let team1Wins = team1.players.reduce((acc, player) => acc + player.wins, 0);
    let team2Wins = team2.players.reduce((acc, player) => acc + player.wins, 0);
    return team1Wins > team2Wins ? team1.name : team2Wins > team1Wins ? team2.name : "Still Tied";
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div>
            <h1>Team Round-Robin Tournament</h1>
            <button onClick={generateRounds}>Generate Rounds</button>
            <h2>Rounds</h2>
            {rounds.map((round, roundIndex) => (
              <div key={roundIndex}>
                <h3>Round {roundIndex + 1}</h3>
                <ul>
                  {round.map((match) => (
                    <li key={match.id}>
                      {match.team1} vs {match.team2} - Winner: {match.result || "TBD"}
                      <Link to={`/match/${match.id}`}><button>View Player Matches</button></Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <h2>Leaderboard</h2>
            <ul>
              {teams
                .sort((a, b) => {
                  if (a.points === b.points) {
                    return determineTiebreaker(a, b) === a.name ? -1 : 1;
                  }
                  return b.points - a.points;
                })
                .map((team) => (
                  <li key={team.name}>
                    {team.name}: {team.points} pts ({team.players.reduce((acc, p) => acc + p.wins, 0)} individual wins)
                  </li>
                ))}
            </ul>
          </div>
        } />
        <Route path="/match/:matchId" element={<PlayerMatch matches={matches} recordPlayerMatchResult={recordPlayerMatchResult} Submit={Submit} />} />
      </Routes>
    </Router>
  );
};

const PlayerMatch = ({ matches, recordPlayerMatchResult, Submit }) => {
  const { matchId } = useParams();
  const match = matches[matchId];

  if (!match) {
    return <div>Match not found. <Link to="/">Back to Matches</Link></div>;
  }

  return (
    <div>
      <h2>Player Matches for {match.team1} vs {match.team2}</h2>
      <ul>
        {match.playerMatches.map((pm, index) => (
          <li key={index}>
            {pm.player1} vs {pm.player2} - Winner: {pm.result || "TBD"}
            <button onClick={() => recordPlayerMatchResult(matchId, index, pm.player1)}>Win {pm.player1}</button>
            <button onClick={() => recordPlayerMatchResult(matchId, index, pm.player2)}>Win {pm.player2}</button>
            <button onClick={() => recordPlayerMatchResult(matchId, index, "draw")}>Draw</button>
          </li>
        ))}
      </ul>
      <button onClick={() => Submit(match)}>Submit</button>
      <Link to="/">Back to Matches</Link>
    </div>
  );
};

export default App;
