import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams} from "react-router-dom";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { Select } from "../ui/select.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import { Badge } from "../ui/badge.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.tsx";


export const AddTeamPage = ({setNewTeam, newTeam, setNewPlayer, newPlayer, addPlayer, addTeam}) =>{
    return(
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
    )
}