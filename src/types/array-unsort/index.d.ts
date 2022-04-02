declare module "array-unsort" {
	declare function unsort<T>(input: T[], algo: "fisher-yates" | "unique-idx"): T[];
	export { unsort };
}
