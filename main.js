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

let Statusmsg;

let confirmed;

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

async function down() {
	N_Status--;
	if (0 > N_Status) N_Status = 3;
}

async function up() {
	N_Status++;
	if (N_Status > 3) N_Status = 0;
}

async function detectkey(key) {
	if (key == 'return') {
		confirmed = true;
		updateStatus();
	}
	if (key == 'up') {
		confirmed = false;
		await down();
		updateStatus();
	}
	if (key == 'down') {
		confirmed = false;
		await up();
		updateStatus();
	}
	display();
}

/**
 * ステータスを設定します。
 * @param mode 'online', 'idle', 'dnd', 'invisible (オフラインなんてありません)
 */

async function updateStatus() {
	let online = color.gray('Online');
	let idle = color.gray('Idle');
	let dnd = color.gray('dnd');
	let invis = color.gray('Invisible');

	// Status set uwu
	if (N_Status === 0 && confirmed === true) {
		Status = 'online';
		// await client.user.setStatus(Status);
	}
	if (N_Status === 1 && confirmed === true) {
		Status = 'idle';
		// await client.user.setStatus(Status);
	}
	if (N_Status === 2 && confirmed === true) {
		Status = 'dnd';
		// await client.user.setStatus(Status);
	}
	if (N_Status === 3 && confirmed === true) {
		Status = 'invisible';
		// await client.user.setStatus(Status);
	}

	// Render
	if (N_Status === 0) online = color.white('online');
	if (N_Status === 1) idle = color.white('idle');
	if (N_Status === 2) dnd = color.white('dnd');
	if (N_Status === 3) invis = color.white('invisible');

	// Render(confirmed)
	if (N_Status === 0 && confirmed === true) online = color.green('online');
	if (N_Status === 1 && confirmed === true) idle = color.green('idle');
	if (N_Status === 2 && confirmed === true) dnd = color.green('dnd');
	if (N_Status === 3 && confirmed === true) invis = color.green('invisible');

	Statusmsg = `
	Status: ${color.cyan(Status)}
	${online}
	${idle}
	${dnd}
	${invis}
	`;
}

async function display() {
	process.stdout.write(
		'\x1bc' +
			`
	${color.cyan('Discord Status Manager')}\n
	${Statusmsg}\n
	${color.gray('(Ctrl+C to exit)')}\n`
	);
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
	// await discord();
	await updateStatus();
	await listener();
	display();
}
/*
setInterval(() => {
    process.stdout.write("\x1bc" + `IP: ${args.target} Port: ${args.port}\n${"=".repeat(30)}\nSend: ${sendCount} Recv: ${recvCount}\n${"=".repeat(30)}\n(Ctrl+C to exit)\n`);
}, 1000);
*/

main();
