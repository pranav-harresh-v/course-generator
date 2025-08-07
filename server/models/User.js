const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});
