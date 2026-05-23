import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
     path: path.join(process.cwd(), '.env')
})

const config = {
     connectionString: process.env.CONNECTIONSTRING as string,
     port: process.env.PORT,
     seckey: process.env.SECRETKEY,
     refreshkey: process.env.REFRESHKEY

}

export default config
