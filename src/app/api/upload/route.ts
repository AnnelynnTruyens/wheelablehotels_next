export const runtime = "edge"; // optional but recommended (Web APIs)
import { put } from "@vercel/blob";

export async function POST(req: Request) {
	try {
		const form = await req.formData();
		const file = form.get("file") as File | null;
		if (!file) {
			return new Response(JSON.stringify({ message: "No file uploaded" }), {
				status: 400,
				headers: { "content-type": "application/json" },
			});
		}

		const ext = file.name?.split(".").pop() ?? "bin";
		const key = `hotels/${Date.now()}-${Math.random()
			.toString(36)
			.slice(2)}.${ext}`;

		// Upload to Vercel Blob; returns a public, CDN-backed URL
		const blob = await put(key, file, { access: "public" });

		return new Response(JSON.stringify({ url: blob.url, key: blob.pathname }), {
			status: 200,
			headers: { "content-type": "application/json" },
		});
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ message: "Upload failed" }), {
			status: 500,
			headers: { "content-type": "application/json" },
		});
	}
}
