import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {

        mongoose.connect ("mongodb+srv://ivanfedericosimari:REWO45Sujm2tdx40@proyectocoder.ii8awpf.mongodb.net/ProyectoCoder")
        console.log("Mongo DB connected");

    } catch (error) {
        console.log(`Error: ${error}`);
    }
}