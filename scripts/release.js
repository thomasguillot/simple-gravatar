const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const package = require('../package.json');

// Ensure release directory exists
const releaseDir = path.join(__dirname, '../release');
if (!fs.existsSync(releaseDir)) {
	fs.mkdirSync(releaseDir);
}

// Create a write stream for the zip file
const output = fs.createWriteStream(path.join(__dirname, '../release', `simple-gravatar-${package.version}.zip`));
const archive = archiver('zip', {
	zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', () => {
	console.log(`Archive created successfully: ${archive.pointer()} total bytes`);
});

// Good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', (err) => {
	if (err.code === 'ENOENT') {
		console.warn(err);
	} else {
		throw err;
	}
});

// Good practice to catch this error explicitly
archive.on('error', (err) => {
	throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add the dist directory to the zip
archive.directory(path.join(__dirname, '../dist/'), 'simple-gravatar');

// Add the languages directory to the zip
archive.directory(path.join(__dirname, '../languages/'), 'simple-gravatar/languages');

// Add the plugin main file to the zip
archive.file(path.join(__dirname, '../simple-gravatar.php'), { name: 'simple-gravatar.php' });

// Add the readme file to the zip
archive.file(path.join(__dirname, '../README.md'), { name: 'README.md' });

// Finalize the archive
archive.finalize(); 