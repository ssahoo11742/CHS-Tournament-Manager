import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams} from "react-router-dom";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { Select } from "../ui/select.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import { Badge } from "../ui/badge.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.tsx";


export const PlayerMatch = ({ matches, recordPlayerMatchResult, Submit }) => {
    console.log(matches)
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
  
