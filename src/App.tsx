import { Box, Flex, Heading, Link, Text, useColorMode } from "@chakra-ui/react";
import Game from "./Game";
import dictionary from "./dictionary.json";

export default function App() {
	let { colorMode } = useColorMode();
	let isDark = colorMode === "dark";

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

				<Game p={6} />

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
