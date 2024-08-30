import userRepository from "../persistence/MongoDB/user.repository";

const newUser = async () => {
    return await userRepository.create();
};


const loginUser = async (email) => {
    return await userRepository.getByEmail(email);
};


const loginGoogle = async (email) => {
    return await userRepository.getByEmail(email);
};

const currentSession = async (email) => {
    return await userRepository.getByEmail(email);
};

export default {
    newUser,
    loginUser,
    loginGoogle,
    currentSession,
};