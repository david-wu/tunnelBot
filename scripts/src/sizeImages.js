const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const alreadySizedFileEndings = new Set([
  '_lg.jpg',
  '_md.jpg',
  '_sm.jpg',
  '_ss.jpg',
  '_xs.jpg',
]);

if (argv.f) {
  deleteSizedImages('src/assets/images');
}
sizeImages('src/assets/images');

function deleteSizedImages(rootImagesPath) {
  iterateFilesDeep(rootImagesPath, (imagePath) => {
    const imageEnding = imagePath.slice(imagePath.length - 7)
    if (alreadySizedFileEndings.has(imageEnding)) {
      console.log('deleting', imagePath);
      fs.unlinkSync(imagePath);
    }
  });
}

function sizeImages(rootImagesPath) {
  iterateFilesDeep(rootImagesPath, (imagePath) => {
    const imagePathRoot = imagePath.slice(0, imagePath.length - 4);
    const imageEnding = imagePath.slice(imagePath.length - 7);
    if (alreadySizedFileEndings.has(imageEnding)) {
      console.log(`skipping  ${imagePathRoot}, use -f to delete and force resize`);
      return;
    }
    if (fs.existsSync(`${imagePathRoot}_sm.jpg`)) {
      console.log(`skipping  ${imagePathRoot}, ***_sm.jpg file detected`);
      return;
    }
    if (imagePath.includes('.DS_Store')) {
      return;
    }
    Jimp.read(imagePath).then((image) => {
      console.log(`sizing ${imagePath}`)
      image.resize(1080, Jimp.AUTO).quality(80).write(`${imagePathRoot}_lg.jpg`);
      image.resize(640, Jimp.AUTO).quality(80).write(`${imagePathRoot}_md.jpg`);
      image.resize(320, Jimp.AUTO).quality(80).write(`${imagePathRoot}_sm.jpg`);
      image.resize(160, Jimp.AUTO).quality(80).write(`${imagePathRoot}_ss.jpg`);
      image.resize(80, Jimp.AUTO).quality(80).write(`${imagePathRoot}_xs.jpg`);
    });
  });
}

function iterateFilesDeep(rootPath, iteratee) {
  const dirChildren = fs.readdirSync(rootPath);
  dirChildren.forEach((child) => {
    const childPath = path.join(rootPath, child);
    const isDir = fs.lstatSync(childPath).isDirectory();
    if (isDir) {
      iterateFilesDeep(childPath, iteratee);
    } else {
      iteratee(childPath);
    }
  });
}
