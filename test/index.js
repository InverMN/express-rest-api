import { run } from '../src/app.js'
import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)

export const app = run('test')
process.env.MODE = 'test'

export default chai.request(app).keepOpen()