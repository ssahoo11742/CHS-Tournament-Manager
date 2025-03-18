import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams} from "react-router-dom";
import { Button } from "./components/ui/button.tsx";
import { Input } from "./components/ui/input.tsx";
import { Select } from "./components/ui/select.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card.tsx";
import { Badge } from "./components/ui/badge.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table.tsx";
import { AddTeamPage } from "./components/sections/addTeam.tsx";
import { TeamList } from "./components/sections/teamList.tsx";
import { Leaderboard } from "./components/sections/leaderboard.jsx";
import { Rounds } from "./components/sections/rounds.tsx";
import { PlayerMatch } from "./components/sections/playerMatch.tsx";
import supabase from "./config/supabaseClient.js";

const App = () => {
  const [teams, setTeams] = useState([
    { name: "CHS-A", players: [{ name: "CHS-A-1", rating: 1200, wins: 0}, { name: "CHS-A-2", rating: 1300, wins: 0 }, { name: "CHS-A-3", rating: 1250, wins: 0 }, { name: "CHS-A-4", rating: 1220, wins: 0 }], points: 0 },
    { name: "CHS-B", players: [{ name: "CHS-B-1", rating: 1190, wins: 0}, { name: "CHS-B-2", rating: 1280, wins: 0 }, { name: "CHS-B-3", rating: 1240, wins: 0 }, { name: "CHS-B-4", rating: 1210, wins: 0 }], points: 0 },
    { name: "LHS-A", players: [{ name: "LHS-A-1", rating: 1320, wins: 0}, { name: "LHS-A-2", rating: 1350, wins: 0 }, { name: "LHS-A-3", rating: 1290, wins: 0 }, { name: "LHS-A-4", rating: 1310, wins: 0 }], points: 0 },
    { name: "LHS-B", players: [{ name: "LHS-B-1", rating: 1260, wins: 0 }, { name: "LHS-B-2", rating: 1230, wins: 0 }, { name: "LHS-B-3", rating: 1270, wins: 0 }, { name: "LHS-B-4", rating: 1240, wins: 0 }], points: 0 },
    { name: "BHMS-A", players: [{ name: "BHMS-A-1", rating: 1330, wins: 0 }, { name: "BHMS-A-2", rating: 1290, wins: 0 }, { name: "BHMS-A-3", rating: 1340, wins: 0 }, { name: "BHMS-A-4", rating: 1300, wins: 0 }], points: 0 },
    { name: "BHMS-B", players: [{ name: "BHMS-B-1", rating: 1230, wins: 0 }, { name: "BHMS-B-2", rating: 1270, wins: 0 }, { name: "BHMS-B-3", rating: 1220, wins: 0 }, { name: "BHMS-B-4", rating: 1250, wins: 0 }], points: 0 },
    { name: "THS-A", players: [{ name: "THS-A-1", rating: 1310, wins: 0 }, { name: "THS-A-2", rating: 1360, wins: 0 }, { name: "THS-A-3", rating: 1280, wins: 0 }, { name: "THS-A-4", rating: 1320, wins: 0 }], points: 0 }
  ]);
  const [newTeam, setNewTeam] = useState({ name: "", players: [] });
  const [newPlayer, setNewPlayer] = useState({ name: "", rating: 1200 });
  const [matches, setMatches] = useState([]);
  const [rounds, setRounds] = useState([]);
  
  const assignColor = () => {
    let pairity = false;
    teams.forEach(team => {
      team.players.forEach(player =>{
        if(pairity){
          player.color = "bw".repeat(teams.length);
        }else{
          player.color = "wb".repeat(teams.length);
        }
        pairity = !pairity;
      })
    });
    console.log(teams)
  }
  assignColor()
  const addPlayer = () => {
    if (newPlayer.name.trim() === "") return;
    setNewTeam({ ...newTeam, players: [...newTeam.players, { ...newPlayer, wins: 0 }] });
    setNewPlayer({ name: "", rating: 1200 });
  };

  const addTeam = () => {
    if (newTeam.name.trim() === "" || newTeam.players.length < 4) return;
    setTeams([...teams, { ...newTeam, points: 0 }]);
    setNewTeam({ name: "", players: [] });
  };

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

  const generatePlayerMatches = (players1, players2, round) => {
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
            playerMatches: generatePlayerMatches(team1.players, team2.players, round),
            round: round
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
  console.log(newTeam)
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-white">CHS Chess Club Tournament Manager</h1>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <AddTeamPage setNewTeam={setNewTeam} newTeam={newTeam} setNewPlayer={setNewPlayer} newPlayer={newPlayer} addPlayer={addPlayer} addTeam={addTeam}/>
              
              <TeamList teams={teams} generateRounds={generateRounds} />
              
            </div>
            
            {rounds.length > 0 && (
              <Rounds rounds={rounds} />
            )}
            
            <Leaderboard teams={teams} determineTiebreaker={determineTiebreaker}/>
          </div>
        } />
        <Route path="/match/:matchId" element={<PlayerMatch matches={matches} recordPlayerMatchResult={recordPlayerMatchResult} Submit={Submit} />} />
      </Routes>
    </Router>
  );
};

export default App;