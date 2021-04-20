import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";



describe("Create Statement", () => {

    let inMemoryUserRepository: InMemoryUsersRepository;
    let inMemoryStatementRepository: InMemoryStatementsRepository;
    let createStatementUseCase: CreateStatementUseCase;
    let createUserUseCase: CreateUserUseCase;

    beforeEach(() => {
        inMemoryStatementRepository = new InMemoryStatementsRepository();
        inMemoryUserRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    });

    it("Should be able to create a new statement", async () => {
        const user = await createUserUseCase.execute({
            name: "Test User",
            email: "test@test.com",
            password: "1234"
        });

        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: "deposit" as OperationType,
            amount: 3000.0,
            description: "First Deposit"
        });

        expect(statement).toHaveProperty("id");
    });


    it("Should not be able to create a inexistent user statement", () => {
        expect(async() => {
            const statement = await createStatementUseCase.execute({
                user_id: "12344",
                type: "deposit" as OperationType,
                amount: 3000.0,
                description: "First Deposit"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("Should not be able a withdraw statement with amount greater than balance", () => {
        expect(async() => {

            const user = await createUserUseCase.execute({
                name: "Test User",
                email: "test@test.com",
                password: "1234"
            });
            const statement = await createStatementUseCase.execute({
                user_id: user.id as string,
                type: "withdraw" as OperationType,
                amount: 3000.0,
                description: "First Deposit"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });

});