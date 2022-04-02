export enum GuessKind {
	Guess = "guess",
	Correct = "correct",
	Incorrect = "incorrect",
	WrongSpot = "wrong-spot",
}

export interface Guess {
	letter: string;
	kind: GuessKind;
}
