import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { IncomingForm, File } from "formidable";

// Disable default body parsing so formidable can read the stream
export const config = {
	api: {
		bodyParser: false,
	},
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const uploadDir = path.join(process.cwd(), "public/uploads");

	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}

	const form = new IncomingForm({
		multiples: false,
		uploadDir,
		keepExtensions: true,
	});

	form.parse(req, (err, fields, files) => {
		if (err) {
			console.error("Upload error", err);
			res.status(500).json({ message: "Upload failed" });
			return;
		}

		const fileEntry = files.file;
		const file = Array.isArray(fileEntry) ? fileEntry[0] : fileEntry;

		if (!file) {
			res.status(400).json({ message: "No file uploaded" });
			return;
		}

		const filename = path.basename(file.filepath);
		res.status(200).json({ message: "File uploaded successfully", filename });
	});
}
