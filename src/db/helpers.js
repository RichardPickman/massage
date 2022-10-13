// import fs from 'fs/promises'
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
    const withoutHash = file.split('.')[0];
    console.log(`import ${withoutHash.split('-').join('')} from './img/${file}'`)
    // console.log(`
    // {
    //   question: "",
    //   img: ${withoutHash.split('-').join('')},
    //   incorrectAnswers: [
    //     '${getRandom(file, files).split('.')[0].split('-').join(' ')}',
    //     '${getRandom(file, files).split('.')[0].split('-').join(' ')}',
    //     '${getRandom(file, files).split('.')[0].split('-').join(' ')}',
    //   ],
    //   correctAnswer: '${withoutHash.split('-').join(' ')}',
    // },
    // `)
  }
}

getFiles()
