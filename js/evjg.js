game.state.add('load', loadState);
game.state.add('bowling', bowlingState);
game.state.add('bubblebump', bubbleBumpState);

// transition between states
game.state.add('transition', transitionState);

game.state.start('load');