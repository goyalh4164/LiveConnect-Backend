import app from "./index.js";
import { connectToDb } from "./src/config/db.js";

app.listen(8000, async () => {
  await connectToDb();
  console.log("Server is live at PORT 8000");
});