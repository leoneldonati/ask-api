import mongoose from "mongoose";
import { dbPass, dbUser } from "./config";

const dbUri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.fo3dmlm.mongodb.net`

function connect () {
  mongoose.connect(dbUri, {
    appName: 'Cluster0',
    writeConcern: { w: 'majority' },
    retryWrites: true,
    dbName: 'tellme'
  })
    .then(({ connection }) => console.log({ status: 'connected', db: connection.db.databaseName }))
    .catch((error) => console.error({ status: 'error', error }))
}

export default connect