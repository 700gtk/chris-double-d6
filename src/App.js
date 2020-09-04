import React from 'react';
import './App.css';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rolls: [],
            userRolls: []
        };
        this.iterations = React.createRef();
        this.startSimulation = this.startSimulation.bind(this);
    }

    startSimulation() {
        let arraySize = 13;
        let rolls = [];
        let userRolls = [];
        while (arraySize--) {
            rolls.push(0);
            userRolls.push(0)
        }

        for (let i = 0; i < this.iterations.current.value; i++) {
            let d1 = rollDice();
            let d2 = rollDice();

            //Roll statistics
            rolls[d1] += 1;
            rolls[d2] += 1;
            let combined = d2 + d1;
            rolls[combined] += 1;

            //user Selection
            let d1PrevRolls = userRolls[d1];
            let d2PrevRolls = userRolls[d2];
            let combinedPrevRolls = userRolls[combined];

            //pick least selected number
            let userChoice = d1PrevRolls;
            let userValue = d1;
            if (d2PrevRolls < d1PrevRolls) {
                userChoice = d2PrevRolls;
                userValue = d2;
            } else if (d2PrevRolls === d1PrevRolls) { //if tie
                if (d2 < d1) {
                    userValue = d2;
                    userChoice = d2PrevRolls
                } else {
                    userValue = d1;
                    userChoice = d1PrevRolls;
                }

            }
            if (combinedPrevRolls <= userChoice) {//if combinedPrevRolls is less than or equal to.
                userChoice = combinedPrevRolls;
                userValue = combined
            }

            userRolls[userValue] += 1;
        }
        this.setState({
            rolls: rolls,
            userRolls: userRolls
        })
    }

    render() {
        let totalRolls = this.state.rolls.map((n, q) => {
            if (q === 0) {
                return;
            }
            return ({name: q, rollResult: n})
        });
        let userChoices = this.state.userRolls.map((n, q) => {
            if (q === 0) {
                return;
            }
            return ({name: q, usersChoices: n})
        });

        return (
            <div className="App">
                <h1>D6 Simulator</h1>
                <input type="text" pattern="[0-9]*" ref={this.iterations}/>
                <button onClick={this.startSimulation}>Start</button>
                <div>
                    <div className="chartHolder">
                        <BarChart
                            width={500}
                            height={300}
                            data={totalRolls}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Bar dataKey="rollResult" fill="#8884d8"/>
                        </BarChart>
                    </div>
                    <div className="chartHolder">
                        <BarChart
                            width={500}
                            height={300}
                            data={userChoices}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Bar dataKey="usersChoices" fill="#8884d8"/>
                        </BarChart>
                    </div>
                </div>
            </div>
        );
    }
}


export default App;

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}
