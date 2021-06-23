import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";


interface IRequest{
    amount: number,
    description: string,
    sender_id: string,
    user_id: string
}

@injectable()
class TransferStatementUseCase{

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StatementsRepository')
        private statementsRepository: IStatementsRepository
    ){}

    async execute({amount, description, sender_id, user_id}: IRequest): Promise<void>{

        //Should be able to transfer amount to existing user.

        const sender_user = await this.usersRepository.findById(sender_id);

        if(!sender_user){
            throw new AppError("Sender User not found!");
        }

        //Should not be able to transfer amount with insuficient funds

        const user_balance = await this.statementsRepository.getUserBalance({user_id});

        if(user_balance.balance < amount){
            throw new AppError("Insuficient funds!");
        }

        await this.statementsRepository.create({
            amount,
            description,
            sender_id, 
            user_id,
            type: 'transfer' as OperationType
        });

        await this.statementsRepository.create({
            amount,
            description,
            receiver_id: user_id, 
            user_id: sender_id,
            type: 'transfer' as OperationType
        });

    }
}

export {TransferStatementUseCase};

