// import fs from 'fs/promises'
const { copyFile } = require('fs');
const fs = require('fs/promises');
const path = require('path');
// import path from 'path'

const getRandom = (correctAnswer, arr) => {
  const file = arr[Math.floor(Math.random() * arr.length)]

  if (file === correctAnswer) {
    return getRandom(correctAnswer, arr)
  }

  return file;
}

const getFiles = async () => {
  const localPath = path.resolve(__dirname)
  const files = await fs.readdir(localPath + '/img')

  for (const file of files) {
    // console.log(`import ${file.split('.')[0].split('-').join('')} from './img/${file}'`)
    console.log(`{
      question: "",
      img: images.${file.split('.')[0].split('-').join('')},
      incorrectAnswers: [
        '${getRandom(file, files).split('.')[0].split('-').join(' ')}',
        '${getRandom(file, files).split('.')[0].split('-').join(' ')}',
        '${getRandom(file, files).split('.')[0].split('-').join(' ')}',
      ],
      correctAnswer: '${file.split('.')[0].split('-').join(' ')}',
    },`)
  }
}

const removeHash = async () => {
  const localPath = path.resolve(__dirname)
  const files = await fs.readdir(localPath + '/img')
  const isCopyDirExist = files.includes('copy');
  
  !isCopyDirExist && await fs.mkdir(path.join(localPath, 'img', 'copy'))

  for (const file of files) {
    const imgPath = path.join(localPath, 'img')
    const [name, _, format] = file.split('.');

    copyFile(path.join(imgPath, file), path.join(imgPath, 'copy', `${name}.${format}`), (err) => err && console.log(err))
  }

  return;
}

// removeHash();
// getFiles();
