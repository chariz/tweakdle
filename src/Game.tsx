import { Box, BoxProps, Button, Flex, Text, useColorMode } from "@chakra-ui/react";
import { unsort } from "array-unsort";
import Board from "./Board";
import Keyboard from "./Keyboard";
import { useMemo, useState } from "preact/hooks";
import dictionary from "./dictionary.json";
import { Guess, GuessKind } from "./State";

let randomItem = unsort(dictionary, "unique-idx")[0]!;
let word = unsort(randomItem.nameBits, "unique-idx")[0]!.toUpperCase();

export default function Game(props: BoxProps) {
	let [board, setBoard] = useState<(Guess | null)[][]>([
		[null, null, null, null, null],
		[null, null, null, null, null],
		[null, null, null, null, null],
		[null, null, null, null, null],
		[null, null, null, null, null]
	]);
	let [currentRow, setCurrentRow] = useState(0);
	let currentCol = useMemo<number>(
		() => board[currentRow]?.indexOf(null) ?? -1,
		[board, currentRow]
	);
	let [isCorrect, setIsCorrect] = useState(false);
	let [isFinished, setIsFinished] = useState(false);

	let { colorMode } = useColorMode();
	let isDark = colorMode === "dark";

	let handleGuess = () => {
		let row = currentRow === -1 ? 4 : currentRow;
		let guesses = board[row]!;
		if (guesses.includes(null)) {
			return;
		}
		let newGuesses = (guesses as Guess[]).map((item, i) => {
			let expected = word[i]!;
			let kind: GuessKind;
			if (item.letter === expected) {
				kind = GuessKind.Correct;
			} else {
				kind = word.includes(item.letter)
					? GuessKind.WrongSpot
					: GuessKind.Incorrect;
			}
			return { ...item, kind };
		});
		setBoard((board) => {
			board[row] = newGuesses;
			return [...board];
		});

		let isCorrect = newGuesses.every((item) => item.kind === GuessKind.Correct);
		setIsCorrect(isCorrect);

		if (isCorrect || row + 1 === board.length) {
			setCurrentRow(-1);
			setIsFinished(true);
		} else {
			setCurrentRow(row + 1);
		}
	};

	let doShare = async () => {
		let emojiBoard = board
			.map((row) =>
				row
					.map((item) => {
						switch (item?.kind) {
							case GuessKind.Correct:
								return "🟩";
							case GuessKind.Incorrect:
								return "⬜️";
							case GuessKind.WrongSpot:
								return "🟨";
						}
						return "⬜️";
					})
					.join("")
			)
			.filter((row) => row !== "⬜️⬜️⬜️⬜️⬜️")
			.join("\n");
		let data = {
			text: `My Tweakdle Stats for ${word}\n\n${emojiBoard}`,
			url: "https://tweakdle.chariz.com/"
		};
		if (navigator.canShare?.(data)) {
			try {
				await navigator.share?.(data);
				return;
			} catch {}
		}
		let tweetURL = new URL("https://twitter.com/intent/tweet");
		tweetURL.searchParams.set("text", `${data.text}\n${data.url}`);
		window.open(tweetURL, "_blank", "noopener");
	};

	return (
		<Box {...props}>
			<Board board={board} />

			{isFinished && (
				<Flex>
					<Box
						maxWidth="300px"
						p={4}
						pt={6}
						mx="auto"
						my={8}
						textAlign="center"
						borderRadius={6}
						backgroundColor={
							isCorrect
								? (isDark
										? "green.700"
										: "green.100")
								: (isDark
										? "red.700"
										: "red.100")
						}
					>
						<Flex alignItems="center" mb={3}>
							<Box
								w="60px"
								borderRadius={13}
								borderWidth="1px"
								borderColor="blackAlpha.100"
								backgroundColor="blackAlpha.50"
								mr={3}
								overflow="hidden"
							>
								{randomItem.icon && (
									<img
										src={randomItem.icon}
										alt=""
										width={60}
										height={60}
										loading="lazy"
									/>
								)}
							</Box>
							<Box textAlign="left">
								<Text fontWeight={900} mt={0.5}>
									{randomItem.name}
								</Text>
								<Text fontSize="sm" color="gray.500">
									by {randomItem.author} — {randomItem.repo}
								</Text>
							</Box>
						</Flex>
						<Text mb={3}>
							{isCorrect ? <>You got it!</> : <>Sorry, you didn’t get it.</>}
						</Text>
						<Text>
							<Button as="a" href="" fontWeight={900} mx={2}>
								New Game
							</Button>
							<Button onClick={doShare} mx={2}>
								Share
							</Button>
						</Text>
					</Box>
				</Flex>
			)}

			<Keyboard
				isFinished={isFinished}
				guesses={board.flat()
					.filter(Boolean) as Guess[]}
				onBackspace={() => {
					if (currentCol === 0 || currentRow === -1) {
						return;
					}
					setBoard((board) => {
						let col = (currentCol === -1 ? 5 : currentCol) - 1;
						console.log(board[currentRow]!, currentCol, col);
						board[currentRow]![col] = null;
						return [...board];
					});
				}}
				onEnter={handleGuess}
				onKeyPress={(key) => {
					if (currentCol === -1 || currentRow === -1) {
						return;
					}
					setBoard((board) => {
						board[currentRow]![currentCol] = {
							kind: GuessKind.Guess,
							letter: key
						};
						return [...board];
					});
				}}
			/>
		</Box>
	);
}
