import mongoose, { mongo } from "mongoose";

export const connectDatabase = () => {
    let DB_URI = "";

    if (process.env.NODE_ENV == "DEVELOPMENT") DB_URI = process.env.DB_LOCAL_URI;
    if (process.env.NODE_ENV == "PRODUCTION") DB_URI = process.env.DB_URI;

    mongoose.connect(DB_URI)
        .then((con) => console.log(`Mongodb database connect successfully with host: ${con?.connection?.host} in ${process.env.NODE_ENV} mode`))
        .catch((error) => console.log(error));

};
