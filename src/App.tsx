import { Box, Button, Flex, Heading, Link, Text, useColorMode } from "@chakra-ui/react";
import Board from "Board";
import Keyboard from "Keyboard";
import { useMemo, useState } from "preact/hooks";
import { Guess, GuessKind } from "State";
import dictionary from "./dictionary.json";
import { unsort } from "array-unsort";

let randomItem = unsort(dictionary, "unique-idx")[0]!;
let word = unsort(randomItem.nameBits, "unique-idx")[0]!.toUpperCase();

export default function App() {
	let [board, setBoard] = useState<(Guess | null)[][]>([
		[null, null, null, null, null],
		[null, null, null, null, null],
		[null, null, null, null, null],
		[null, null, null, null, null],
		[null, null, null, null, null]
	]);
	let [currentRow, setCurrentRow] = useState(0);
	let currentCol = useMemo<number>(() => board[currentRow]?.indexOf(null) ?? -1, [board, currentRow]);
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
				kind = word.includes(item.letter) ? GuessKind.WrongSpot : GuessKind.Incorrect;
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
		<>
			<Box minHeight="100vh" mb={5}>
				<Box
					p={4}
					pt={6}
					textAlign="center"
					borderBottomWidth="1px"
					borderBottomColor={isDark ? "gray.700" : "gray.100"}
				>
					<Heading
						as="h1"
						size="2xl"
						fontStyle="italic"
						color={isDark ? "gray.100" : "gray.900"}
					>
						Tweakdle
					</Heading>
				</Box>

				<Box p={6}>
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
									{isCorrect ? (
										<>You got it!</>
									) : (
										<>Sorry, you didn’t get it.</>
									)}
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

				<Box
					p={6}
					pt={8}
					display="flex"
					textAlign="center"
					borderTopWidth="1px"
					borderTopColor={isDark ? "gray.700" : "gray.100"}
				>
					<Box maxWidth="300px" mx="auto">
						<Text color="gray.500" fontSize="0.75em" fontWeight={500} mb={6}>
							Scroll down to see the list of names you can try on the game
							board.
						</Text>

						<Text color="gray.500" fontSize="0.75em" my={2}>
							A really bad clone of{" "}
							<Link
								href="https://www.nytimes.com/games/wordle/index.html"
								rel="noreferrer"
								target="_blank"
								color="blue.400"
							>
								Wordle
							</Link>{" "}
							hacked together in a few hours by your friends at{" "}
							<Link
								href="https://chariz.com/"
								rel="noreferrer"
								target="_blank"
								color="#fd7423"
								fontWeight={900}
							>
								Chariz
							</Link>{" "}
							for April Fools Day 2022.
						</Text>

						<Text color="gray.500" fontSize="0.75em" my={2}>
							&copy; HASHBANG Productions
							<br />
							Wordle game &copy; New York Times
						</Text>
					</Box>
				</Box>
			</Box>

			<Box p={4}>
				<Heading as="h3" size="md" mb={5}>
					List of tweak names supported by the game
				</Heading>

				{dictionary.map((item) => (
					<Box
						key={item}
						my={2}
						p={2}
						borderWidth="1px"
						borderColor={isDark ? "gray.700" : "gray.100"}
						background={isDark ? "gray.800" : "gray.100"}
						borderRadius={6}
					>
						<Flex alignItems="center">
							<Box
								w="24px"
								h="24px"
								borderWidth="1px"
								borderColor="blackAlpha.100"
								backgroundColor="blackAlpha.50"
								borderRadius={5}
								mr={1}
								overflow="hidden"
							>
								{item.icon && (
									<img
										src={item.icon}
										alt=""
										width={24}
										height={24}
										loading="lazy"
									/>
								)}
							</Box>
							<Text fontWeight={900} mt={0.5}>
								{item.name}
							</Text>
						</Flex>
						<Text fontSize="sm" color="gray.500">
							by {item.author} — {item.section} — {item.repo}
						</Text>
						<Text fontSize="sm" color="gray.500">
							Words recognised: {item.nameBits.join(", ")
								.toUpperCase()}
						</Text>
					</Box>
				))}
			</Box>
		</>
	);
}
