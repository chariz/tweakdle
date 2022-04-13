import { BackgroundProps, Box, BoxProps, Button, ColorProps, useColorMode } from "@chakra-ui/react";
import {type Guess, GuessKind} from "./State";

const keyRows = [
	[..."QWERTYUIOP"],
	[..."ASDFGHJKL"],
	[..."ZXCVBNM"]
];

export default function Keyboard({
	isFinished,
	guesses,
	onKeyPress,
	onBackspace,
	onEnter
}: {
	isFinished: boolean;
	guesses: Guess[];
	onKeyPress(key: string): void;
	onBackspace(): void;
	onEnter(): void;
}) {
	let { colorMode } = useColorMode();
	let isDark = colorMode === "dark";

	let m: BoxProps["m"] = {
		base: 0.5,
		md: 1
	};

	let minWidth: BoxProps["minWidth"] = {
		base: 7,
		md: 8
	};

	let px: BoxProps["px"] = {
		base: 0.5,
		md: 2
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			style={{
				pointerEvents: isFinished ? "none" : "auto"
			}}
		>
			{keyRows.map((row, i) => (
				<Box
					key={row}
					display="flex"
					flexDirection="row"
					justifyContent="center"
					alignItems="center"
				>
					{i === 2 && (
						<Button
							variant="ghost"
							color={isDark ? "gray.200" : "gray.700"}
							size="sm"
							m={m}
							px={px}
							py={6}
							isDisabled={isFinished}
							onClick={onEnter}
						>
							Enter
						</Button>
					)}
					{row.map((key) => {
						let guess = guesses?.find((item) => item.letter === key);
						let backgroundColor: BackgroundProps["backgroundColor"] = "";
						let color: ColorProps["color"] = isDark ? "gray.200" : "gray.900";
						switch (guess?.kind) {
							case GuessKind.Correct:
								backgroundColor = isDark ? "green.700" : "green.100";
								color = isDark ? "gray.200" : "gray.900";
								break;
							case GuessKind.Incorrect:
								backgroundColor = isDark ? "gray.400" : "gray.300";
								break;
							case GuessKind.WrongSpot:
								backgroundColor = isDark ? "yellow.700" : "yellow.100";
								color = isDark ? "gray.200" : "gray.900";
								break;
						}
						return (
							<Button
								key={key}
								backgroundColor={backgroundColor}
								color={color}
								size="sm"
								m={m}
								px={0}
								py={6}
								minWidth={minWidth}
								isDisabled={isFinished}
								onClick={() => onKeyPress(key)}
							>
								{key}
							</Button>
						);
					})}
					{i === 2 && (
						<Button
							variant="ghost"
							color={isDark ? "gray.200" : "gray.700"}
							size="sm"
							m={m}
							px={px}
							py={6}
							isDisabled={isFinished}
							onClick={onBackspace}
						>
							Delete
						</Button>
					)}
				</Box>
			))}
		</Box>
	);
}
