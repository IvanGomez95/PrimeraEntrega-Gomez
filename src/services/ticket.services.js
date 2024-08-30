import { nanoid } from "nanoid";
import ticketRepository from "../persistence/mongoDB/ticket.repository.js";

const createTicket = async (userEmail, totalCart) => {
    const newTicket = {
        amount: totalCart,
        purchaser: userEmail,
        code: nanoid(),
    };
    
    const ticket = await ticketRepository.create(newTicket);
    return ticket;
};

export default { createTicket };

