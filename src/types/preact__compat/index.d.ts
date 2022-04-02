declare module "preact/compat" {
	// Fix missing Preact re-exports Chakra expects
	declare namespace React {
		export { RefCallback, Provider } from "preact";
	}
	export = React;
	export as namespace React;
}

export * from "preact/compat";
