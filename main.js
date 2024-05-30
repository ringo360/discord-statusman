const keypress = require('keypress');
const { Client } = require('discord.js-selfbot-v13');
const client = new Client();
const color = require('picocolors');
const config = require('./config.json');

/**
 * ステータス管理用
 * 0 = online
 * 1 = idle
 * 2 = dnd
 * 3 = invisible
 */
let N_Status = 0;

let Status = 'online';

async function discord() {
	return new Promise((resolve, reject) => {
		client.once('ready', () => {
			// console.log(`Logged in as ${client.user.username}`);
			console.log(`Logged in as ${color.green(client.user.username)}`);
			resolve();
		});

		client.login(config.token).catch(reject);
	});
}

async function incrN() {
	N_Status++;
	if (N_Status > 3) N_Status = 0;
}

async function decrN() {
	N_Status--;
	if (0 > N_Status) N_Status = 3;
}

async function detectkey(key) {
	if (key == 'up') {
		await incrN();
		console.log(N_Status);
		updateStatus();
	}
	if (key == 'down') {
		await decrN();
		console.log(N_Status);
		updateStatus();
	}
}

/**
 * ステータスを設定します。
 * @param mode 'online', 'idle', 'dnd', 'invisible (オフラインなんてありません)
 */
async function updateStatus() {
	if (N_Status === 0) Status = 'online';
	if (N_Status === 1) Status = 'idle';
	if (N_Status === 2) Status = 'dnd';
	if (N_Status === 3) Status = 'invisible';
	console.log(Status);

	await client.user.setStatus(Status);
	console.log('OK');
}

async function display() {
	process.stdout.write(`
	${color.cyan('Discord Status Manager')}\n
	${color.gray('(Ctrl+C to exit)')}\n`);
}

async function listener() {
	keypress(process.stdin);
	process.stdin.on('keypress', function (ch, key) {
		detectkey(key.name);
		// console.log(key.name);
		if (key && key.ctrl && key.name == 'c') process.exit(0);
	});
	process.stdin.setRawMode(true);
	process.stdin.resume();
}

async function main() {
	await discord();
	await listener();
	display();
}
/*
setInterval(() => {
    process.stdout.write("\x1bc" + `IP: ${args.target} Port: ${args.port}\n${"=".repeat(30)}\nSend: ${sendCount} Recv: ${recvCount}\n${"=".repeat(30)}\n(Ctrl+C to exit)\n`);
}, 1000);
*/

main();
