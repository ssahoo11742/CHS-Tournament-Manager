import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams} from "react-router-dom";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { Select } from "../ui/select.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import { Badge } from "../ui/badge.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.tsx";


export const TeamList = ({teams, generateRounds}) =>{
    console.log()
    return(
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
    )
}