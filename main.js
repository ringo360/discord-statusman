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
 * @param mode 'online', 'idle', 'dnd', 'invisible'
 */
async function updateStatus() {
	let online = color.gray('Online');
	let idle = color.gray('Idle');
	let dnd = color.gray('dnd');
	let invis = color.gray('Invisible');

	// Status set uwu
	if (N_Status === 0 && confirmed === true) {
		Status = 'online';
		await client.user.setStatus(Status);
	}
	if (N_Status === 1 && confirmed === true) {
		Status = 'idle';
		await client.user.setStatus(Status);
	}
	if (N_Status === 2 && confirmed === true) {
		Status = 'dnd';
		await client.user.setStatus(Status);
	}
	if (N_Status === 3 && confirmed === true) {
		Status = 'invisible';
		await client.user.setStatus(Status);
	}

	// Render
	if (N_Status === 0) online = color.white('online');
	if (N_Status === 1) idle = color.white('idle');
	if (N_Status === 2) dnd = color.white('dnd');
	if (N_Status === 3) invis = color.white('invisible');

	Statusmsg = `
	Status: ${color.green(Status)}

	${color.gray('(Select with ↑/↓)')}
	${online}
	${idle}
	${dnd}
	${invis}
	`;
}

/**
 * ターミナルへの描画を行います。
 */
async function display() {
	process.stdout.write(
		'\x1bc' +
			`
	${color.cyan('Discord Status Manager')}${Statusmsg}
	${color.gray(`(${color.cyan('Ctrl+C')} to exit)`)}\n`
	);
}

/**
 * キー入力をlistenします。
 */
async function listener() {
	keypress(process.stdin);
	process.stdin.on('keypress', function (ch, key) {
		detectkey(key.name);
		// console.log(key.name);
		if (key && key.ctrl && key.name == 'c') shutdown();
	});
	process.stdin.setRawMode(true);
	process.stdin.resume();
}
/**
 * 終了処理を行います。
 */
async function shutdown() {
	process.stdout.write('\x1bc');
	console.log(`${color.gray('Shutting down...')}`);
	try {
		await client.destroy();
		console.log(`[Discord] ${color.green('Disconnected!')}`);
	} catch (e) {
		console.error(
			`${color.red('Something went wrong...')} ${color.reset(e)}`
		);
		process.exit(1);
	}
	console.log(`${color.cyan('Goodbye!')}`);
	process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function main() {
	await discord();
	await updateStatus();
	await listener();
	display();
}
main();
