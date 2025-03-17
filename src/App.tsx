import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams} from "react-router-dom";
import { Button } from "./components/ui/button.tsx";
import { Input } from "./components/ui/input.tsx";
import { Select } from "./components/ui/select.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card.tsx";
import { Badge } from "./components/ui/badge.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table.tsx";

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

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-white">Team Round-Robin Tournament</h1>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="teamName" className="block text-sm font-medium mb-1">Team Name</label>
                      <Input
                        autocomplete="off"
                        id="teamName"
                        type="text"
                        placeholder="Team Name"
                        value={newTeam.name}
                        onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <h3 className="text-lg font-medium mb-2">Add Players</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label htmlFor="playerName" className="block text-sm font-medium mb-1">Player Name</label>
                          <Input
                            autocomplete="off"
                            id="playerName"
                            type="text"
                            placeholder="Player Name"
                            value={newPlayer.name}
                            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label htmlFor="playerRating" className="block text-sm font-medium mb-1">Rating</label>
                          <Input
                            id="playerRating"
                            type="number"
                            placeholder="Rating"
                            value={newPlayer.rating}
                            onChange={(e) => setNewPlayer({ ...newPlayer, rating: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <Button onClick={addPlayer} className="w-full">Add Player</Button>
                    </div>
                    
                    {newTeam.players.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Team Roster</h4>
                        <div className="bg-muted rounded-md p-3">
                          <ul className="space-y-1">
                            {newTeam.players.map((player, index) => (
                              <li key={index} className="flex justify-between items-center">
                                <span>{player.name}</span>
                                <Badge variant="secondary">Rating: {player.rating}</Badge>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={addTeam} 
                      disabled={newTeam.name.trim() === "" || newTeam.players.length < 4}
                      className="w-full mt-4"
                    >
                      Add Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Team</TableHead>
                          <TableHead>Players</TableHead>
                          <TableHead>Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teams.map((team, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{team.name}</TableCell>
                            <TableCell>{team.players.length}</TableCell>
                            <TableCell>{team.points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <Button onClick={generateRounds} className="w-full">
                      Generate Tournament Rounds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {rounds.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Tournament Rounds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {rounds.map((round, roundIndex) => (
                      <div key={roundIndex} className="space-y-3">
                        <h3 className="text-xl font-semibold flex items-center">
                          <Badge variant="secondary" className="mr-2 text-sm">Round {roundIndex + 1}</Badge>
                          <span>Matches</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {round.map((match) => (
                            <div key={match.id} className="bg-muted rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <div className="font-medium">{match.team1}</div>
                                <div className="text-sm text-muted-foreground">vs</div>
                                <div className="font-medium">{match.team2}</div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  {match.result ? (
                                    <Badge variant={match.result === "draw" ? "draw" : "default"}>
                                      {match.result === "draw" ? "Draw" : `Winner: ${match.result}`}
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">Pending</Badge>
                                  )}
                                </div>
                                <Link to={`/match/${match.id}`}>
                                  <Button variant="secondary" size="sm">View Match</Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Individual Wins</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams
                      .sort((a, b) => {
                        if (a.points === b.points) {
                          return determineTiebreaker(a, b) === a.name ? -1 : 1;
                        }
                        return b.points - a.points;
                      })
                      .map((team, index) => (
                        <TableRow key={team.name}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{team.name}</TableCell>
                          <TableCell>{team.points}</TableCell>
                          <TableCell>{team.players.reduce((acc, p) => acc + p.wins, 0)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-4">Match not found</h2>
            <Link to="/">
              <Button>Back to Tournament</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  console.log(match)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Match: {match.team1} vs {match.team2}</span>
            <Badge variant="secondary">Round {parseInt(matchId) + 1}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Board</TableHead>
                <TableHead>White</TableHead>
                <TableHead>Black</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {match.playerMatches.map((pm, index) => {
                console.log(index)
                let resultFormat = "0-0";

                if (pm.result === pm.player1) {
                  resultFormat = "1-0";
                } else if (pm.result === pm.player2) {
                  resultFormat = "0-1";
                } else if (pm.result === "draw") {
                  resultFormat = "½-½";
                }

                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {(match.players1[index].color[match.round] === "w"? pm.player1: pm.player2)} ({(match.players1[index].color[match.round] === "w"? match.team1: match.team2)})
                      {pm.result === (match.players1[index].color[match.round] === "w"? pm.player1: pm.player2) && <Badge className="ml-2" variant="default">W</Badge>}
                      {pm.result === "draw" && <Badge className="ml-2" variant="draw">D</Badge>}
                    </TableCell>
                    <TableCell className="font-medium">
                      {(match.players1[index].color[match.round] === "b"? pm.player1: pm.player2)} ({(match.players1[index].color[match.round] === "b"? match.team1: match.team2)})
                      {pm.result === (match.players1[index].color[match.round] === "b"? pm.player1: pm.player2) && <Badge className="ml-2" variant="default">W</Badge>}
                      {pm.result === "draw" && <Badge className="ml-2" variant="draw">D</Badge>}
                    </TableCell>
                    <TableCell>{resultFormat}</TableCell>
                    <TableCell>
                      <Select 
                        onChange={(e) => recordPlayerMatchResult(matchId, index, e.target.value)}
                        value={pm.result || ""}
                        className="w-full"
                      >
                        <option value="">Select result</option>
                        <option value={(match.players1[index].color[match.round] === "w"? pm.player1: pm.player2)}>White Won</option>
                        <option value={(match.players1[index].color[match.round] === "b"? pm.player1: pm.player2)}>Black Won</option>
                        <option value="draw">Draw</option>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          <div className="flex justify-between mt-6">
            <Link to="/">
              <Button variant="outline">Back to Tournament</Button>
            </Link>
            <Link to="/">
              <Button onClick={() => {Submit(match)}}>Submit Results</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;