import { app } from "./app";
import { port } from "./config";
import connect from "./db";

app.listen(port, () => {

  connect()
  console.log('hey!')
})