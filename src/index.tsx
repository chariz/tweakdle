import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { render } from "preact";
import App from "./App";

if (process.env["NODE_ENV"] === "development") {
	// preact/debug must be imported before preact.
	// eslint-disable-next-line unicorn/prefer-module
	require("preact/debug");
}

let container = document.querySelector("#app")!;
if (import.meta.webpackHot) {
	// Prepare the app for hot reload by removing all children.
	for (let child of container.childNodes) {
		child.remove();
	}
}

let appTheme = extendTheme({
	config: {
		useSystemColorMode: true
	},
	fonts: {
		heading: "Overpass, -apple-system, BlinkMacSystemFont, sans-serif",
		body: "Overpass, -apple-system, BlinkMacSystemFont, sans-serif"
	},
	fontSizes: {
		"4xl": "2rem"
	},
	components: {
		Text: {
			baseStyle: {
				textTransform: "none",
				letterSpacing: "none"
			}
		}
	}
});

function Root() {
	return (
		<ChakraProvider theme={appTheme}>
			<App />
		</ChakraProvider>
	);
}

render(<Root />, container);
