import { BackgroundProps, Box, BoxProps, Button, ColorProps, useColorMode } from "@chakra-ui/react";
import { type Guess, GuessKind } from "State";

export default function Board({board}: {board: (Guess|null)[][]}) {
	let { colorMode } = useColorMode();
	let isDark = colorMode === "dark";

	let size: BoxProps["w"] = {
		base: 14,
		sm: 16,
		md: 20
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			my={4}
		>
			{board.map((row) => (
				<Box key={row} display="flex" flexDirection="row" justifyContent="stretch" alignItems="stretch">
					{row.map((guess) => {
						let backgroundColor: BackgroundProps["backgroundColor"] = "";
						let color: ColorProps["color"] = isDark ? "gray.200" : "gray.900";
						switch (guess?.kind) {
							case GuessKind.Guess:
								backgroundColor = isDark ? "gray.500" : "gray.300";
								break;
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
								as="div"
								key={guess}
								w={size}
								h={size}
								m={1}
								pt={1}
								fontSize="4xl"
								fontWeight={500}
								backgroundColor={backgroundColor}
								color={color}
								style={{
									pointerEvents: "none"
								}}
							>
								{guess?.letter}
							</Button>
						);
					})}
				</Box>
			))}
		</Box>
	);
}
