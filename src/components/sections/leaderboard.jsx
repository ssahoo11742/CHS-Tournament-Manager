import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams} from "react-router-dom";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { Select } from "../ui/select.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import { Badge } from "../ui/badge.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.tsx";


export const Leaderboard = ({teams, determineTiebreaker}) =>{
    return(
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
    )
}