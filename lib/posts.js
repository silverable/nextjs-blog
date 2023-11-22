import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
	const fileNames = fs.readdirSync(postsDirectory);
	const d = fileNames.map((fileName) => {
		const id = fileName.replace(/\.*md/, '');
		const p = path.join(postsDirectory,fileName);
		const content = fs.readFileSync(p);
		const matterData = matter(content);

		return {
			id,
			...matterData.data,
		}
	});

	return d.sort((a,b) => {
		if (a.date < b.date) {
			return 1;
		}
		return -1;
	});
}

export function getAllPostIds() {
	const fileNames = fs.readdirSync(postsDirectory);
	return fileNames.map((fileName) => {
		return {
			params: {
				id: fileName.replace(/\.*md/, ''),
			}
		}
	});
}

export async function getPostData(id) {
	const p = path.join(postsDirectory,`${id}.md`);
	const content = fs.readFileSync(p);
	const matterData = matter(content);

	const processedContent = await remark()
		.use(html)
		.process(matterData.content);
	const contentHtml = processedContent.toString();

	return {
		id,
		contentHtml,
		...matterData.data,
	};
}

