import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams} from "react-router-dom";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { Select } from "../ui/select.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import { Badge } from "../ui/badge.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.tsx";


export const Rounds = ({rounds}) =>{
    console.log()
    return(
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
    )
}