const yargs = require('yargs')
const ytdl = require('ytdl-core')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const readline = require('readline')
const args = yargs.argv;
const youtube_video = args.video;
var fs = require('fs');

if(!youtube_video) {
	console.log('Coloque o ID do vídeo');
}

const getVideoInfo = async () => {
	process.stdout.write('Carregando informações');
	let info = await ytdl.getInfo(youtube_video);
	return info;
}

const shot = async () => {
	let start = Date.now();
	let infodata = await getVideoInfo();
	let filename = infodata.videoDetails.title.split(' ').join('-').toLowerCase() + ".mp3";
	console.log('Download será feito automaticamente...');
	
	let audio = await ytdl(youtube_video, { quality: 'lowest'});
	if(audio) {
		var dir = './mp3';
		
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		console.log('Áudio encontrado!');
		ffmpeg(audio)
		  .audioBitrate(128)
		  .save(`${__dirname}/mp3/${filename}`)
		  .on('progress', p => {
			  readline.cursorTo(process.stdout, 0);
			  process.stdout.write(`${p.targetSize} KB downloaded`);
		  })
		  .on('end', () => {
			  console.log(`\n`);
			  console.log(`\nDownload concluído do vídeo: ${infodata.videoDetails.title} - ${(Date.now() - start) / 1000}s`);
			  console.log(`\n`);
		  })
		  .on('error', (e) => {
			  console.log(e);
		  });
	}

}



shot();

