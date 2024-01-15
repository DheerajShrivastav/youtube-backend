import mongoose from "mongoose";
const likeSchema = new mongoose.Schema({
    Comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
    }
    
},{ timestapms: true});
export default mongoose.model("Like", likeSchema);