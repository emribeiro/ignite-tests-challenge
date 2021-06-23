import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferStatementUseCase } from "./TransferStatementUseCase";



class TransferStatementController{

    async handle(request: Request, response: Response): Promise<Response>{

        const transferStatementUseCase = container.resolve(TransferStatementUseCase);

        const {amount, description} = request.body;

        const sender_id = request.params.user_id;

        const user = request.user;

        await transferStatementUseCase.execute({
            amount,
            description,
            sender_id,
            user_id: user.id
        })

        return response.status(201).send();
    }

}

export {TransferStatementController}