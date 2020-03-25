import inquirer from 'inquirer'
import archiver from 'archiver'
import axios from 'axios'
import fs from 'fs'
import cmdArgs from './utils/cmdArgs'
import FormData from 'form-data'

if (!cmdArgs || !cmdArgs.modelDir) {
  throw new Error('modelDir is undefined')
}

const host = 'http://bb864.l.dedikuoti.lt:3005/'

const questions = [
  {
    name: 'username',
    type: 'input',
    message: 'Enter your gepick username or e-mail address:',
    validate: function(value: string) {
      if (value.length > 5) {
        return true
      } else {
        return 'Please enter your username or e-mail address.'
      }
    },
  },
  {
    name: 'password',
    type: 'password',
    message: 'Enter your password:',
    validate: function(value: string) {
      if (value.length > 5) {
        return true
      } else {
        return 'Please enter your password.'
      }
    },
  },
]

const ZIP_FILE_NAME = './model.zip'

function zipModel(dir: string) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(ZIP_FILE_NAME, { flags: 'w' })
    const archive = archiver('zip').directory(dir, false)

    output.on('close', function() {
      console.log(archive.pointer() + 'total bytes')
      resolve('archiver has been finalized and the output file descriptor has closed.')
    })

    archive.on('error', function(err) {
      reject('error while ziping')
      throw err
    })

    archive.pipe(output)

    archive.finalize()
  })
}

function uploadModel(username: string, password: string) {
  const form = new FormData()
  const stream = fs.createReadStream(ZIP_FILE_NAME)

  form.append('username', username)
  form.append('password', password)
  form.append('file', stream)

  const formHeaders = form.getHeaders()

  axios
    .post(host + 'upload_model', form, {
      headers: {
        ...formHeaders,
      },
    })
    .then((response) => response)
    .catch((error) => error)
}

interface Answers {
  username: string
  password: string
}

async function push() {
  try {
    const answers: Answers = await inquirer.prompt(questions)

    console.log(answers)
    await axios.post(host + 'login', answers)
    await zipModel(cmdArgs?.modelDir!)
    uploadModel(answers.username, answers.password)
  } catch (err) {
    console.log(err)
  }
}

push()

/*
prompt.get(promptAttributes, function(err: object, userInput: IPrompt): void | number {
  
	if (err) {
    console.log(err)
    return 1
  } else {
    console.log('Command-line received data:')
    const { username, password } = userInput

    const reqBody = {
      username: username,
      password: password,
    }

    const modelInfo = JSON.parse(fs.readFileSync(modelDir + '/model.json', 'utf8'))

    console.log('MODEL INFO', modelInfo)

    axios
      .post(host + 'login2', reqBody)
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
})
	*/
