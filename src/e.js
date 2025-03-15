import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";

const App = () => {
  const [teams, setTeams] = useState([
    { name: "chelm", players: [{ name: "Alice", rating: 1200 }, { name: "Bob", rating: 1300 }], points: 0 },
    { name: "bill", players: [{ name: "Charlie", rating: 1250 }, { name: "David", rating: 1350 }], points: 0 },
    { name: "dirp", players: [{ name: "Eve", rating: 1280 }, { name: "Frank", rating: 1320 }], points: 0 }
  ]);
  const [matches, setMatches] = useState([]);
  const [scores, setScores] = useState({});
  const [rounds, setRounds] = useState([]);
  const Submit = (matches) =>{
    let tms = [...teams];
    console.log(matches)
    if(matches.result === matches.team1){
      tms[tms.findIndex(team => team.name === matches.team1)].points+=2;
      console.log(tms)
    }else if(matches.result === matches.team2){
      tms[tms.findIndex(team => team.name === matches.team2)].points+=2;
    }else{
      console.log("hey")
      tms[tms.findIndex(team => team.name === matches.team1)].points+=1;
      tms[tms.findIndex(team => team.name === matches.team2)].points+=1;
    }
    setTeams(tms)
    console.log(teams)
  }
  const generateMatches = () => {
    let teamMatches = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        teamMatches.push({
          team1: teams[i].name,
          team2: teams[j].name,
          players1: teams[i].players,
          players2: teams[j].players,
          result: null,
          playerMatches: generatePlayerMatches(teams[i].players, teams[j].players)
        });
      }
    }
    setMatches(teamMatches);
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

  const determineMatchWinner = (match) => {
    let team1Wins = match.playerMatches.filter(pm => pm.result === pm.player1).length;
    let team2Wins = match.playerMatches.filter(pm => pm.result === pm.player2).length;
    if (team1Wins > team2Wins) return match.team1;
    if (team2Wins > team1Wins) return match.team2;
    return "draw";
  };

  const recordPlayerMatchResult = (matchId, playerMatchIndex, winner) => {
    let newMatches = [...matches];
    newMatches[matchId].playerMatches[playerMatchIndex].result = winner;
    newMatches[matchId].result = determineMatchWinner(newMatches[matchId]);
    setMatches(newMatches);
    // updateTeamScores(newMatches);
  };

  const updateTeamScores = (matches) => {
    let newScores = {};
    matches.forEach(match => {
      let team1Wins = match.playerMatches.filter(pm => pm.result === pm.player1).length;
      let team2Wins = match.playerMatches.filter(pm => pm.result === pm.player2).length;
      
      if (team1Wins > team2Wins) {
        newScores[match.team1] = (newScores[match.team1] || 0) + 2;
        newScores[match.team2] = (newScores[match.team2] || 0);
      } else if (team2Wins > team1Wins) {
        newScores[match.team2] = (newScores[match.team2] || 0) + 2;
        newScores[match.team1] = (newScores[match.team1] || 0);
      } else {
        newScores[match.team1] = (newScores[match.team1] || 0) + 1;
        newScores[match.team2] = (newScores[match.team2] || 0) + 1;
      }
    });
    setScores(newScores);
  };

  const generateRounds = () => {
    generateMatches()
    let shuffledTeams = [...teams];
    if (shuffledTeams.length % 2 !== 0) shuffledTeams.push({ name: "BYE", players: [], points: 0 });
    let numRounds = shuffledTeams.length - 1;
    let matchRounds = [];

    for (let round = 0; round < numRounds; round++) {
      let roundMatches = [];
      for (let i = 0; i < shuffledTeams.length / 2; i++) {
        let team1 = shuffledTeams[i];
        let team2 = shuffledTeams[shuffledTeams.length - 1 - i];
        if (team1.name !== "BYE" && team2.name !== "BYE") {
          roundMatches.push({
            team1: team1.name,
            team2: team2.name,
            players1: team1.players,
            players2: team2.players,
            result: null,
            playerMatches: generatePlayerMatches(team1.players, team2.players)
          });
        }
      }
      matchRounds.push(roundMatches);
      shuffledTeams.splice(1, 0, shuffledTeams.pop());
    }
    setRounds(matchRounds);
  };
  return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Team Round-Robin Tournament</h1>
                <button onClick={generateRounds}>Generate Rounds</button>
                <h2>Rounds</h2>
                {rounds.map((round, roundIndex) => (
                  <div key={roundIndex}>
                    <h3>Round {roundIndex + 1}</h3>
                    <ul>
                      {round.map((match, matchIndex) => (
                        <li key={matchIndex}>
                          {match.team1} vs {match.team2} - Winner: {match.result || "TBD"}
                          <Link to={`/match/${matchIndex}`} el><button>View Player Matches</button></Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            }
          />
          <Route path="/match/:matchId" element={<PlayerMatch matches={matches} recordPlayerMatchResult={recordPlayerMatchResult} Submit={Submit} />} />
        </Routes>
      </Router>
    );
  };

const PlayerMatch = ({ matches, recordPlayerMatchResult, Submit }) => {
  const { matchId } = useParams();
  const match = matches[matchId];
  console.log(matches)
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
      <button onClick={() => Submit(match)}>submit</button>
      <Link to="/">Back to Matches</Link>
    </div>
  );
};

export default App;
