import net from "node:net";

export function isPortAvailable(port) {
	return new Promise((resolve) => {
		const server = net.createServer();

		server.once("error", (err) => {
			if ("code" in err && err.code === "EADDRINUSE") {
				resolve(false);
			}
		});

		server.once("listening", () => {
			server.close();
			resolve(true);
		});

		server.listen(port);
	});
}

export async function generatePort() {
	const port = Math.floor(Math.random() * 1000) + 9000;
	if (await isPortAvailable(port)) return port;

	return generatePort();
}
