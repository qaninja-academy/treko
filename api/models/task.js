import mongoose from 'mongoose';

let Task = new mongoose.Schema({
    title: String,
    owner: String,
    done: Boolean
});

export default mongoose.model('Task', Task);