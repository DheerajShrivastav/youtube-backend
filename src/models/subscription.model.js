import mongoose from "mongoose";
const { Schema } = mongoose;
const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,//user subscribeing to the other user
        ref: 'User',
    },
    channel: {
        type: Schema.Types.ObjectId,//subscriber is the user who is subscribing to the channel
        ref: 'User',
    },

}, { timestamps: true })
export default mongoose.model('Subscription', subscriptionSchema)