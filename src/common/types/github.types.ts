export interface Commit {
	id: string;
	tree_id: string;
	distinct: boolean;
	message: string;
	timestamp: Date;
	url: string;
	author: unknown;
	committer: unknown;
	added: unknown;
	removed: unknown;
	modified: unknown;
}
