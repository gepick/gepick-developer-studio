// @ts-ignore
import prompt from 'prompt'
import axios from 'axios'
import fs from 'fs'

const host = 'http://bb864.l.dedikuoti.lt:3005/'

const args = process.argv.slice(2)
const modelDir = args[0]

const promptAttributes = [
  {
    name: 'username',
    validator: /^[a-zA-Z\s\-]+$/,
    warning: 'Username is not valid, it can only contains letters, spaces, or dashes',
  },
  {
    name: 'password',
    hidden: true,
  },
]

interface IPrompt {
  username: string
  password: string
}

prompt.get(promptAttributes, function(err: object, userInput: IPrompt):void | number {
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
