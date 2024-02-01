
import app from "./index.js";
import { connectToDb } from './src/config/db.js';

const PORT = 8000;


app.listen(PORT, async () => {
  await connectToDb();
  console.log(`Server is live at PORT ${PORT}`);
});
