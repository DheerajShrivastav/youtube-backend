import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const commentSchema = new mongoose.Schema({
    constent: {
        type: String,
        required: true,
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},{ timestapms: true});
commentSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model("Comment", commentSchema);