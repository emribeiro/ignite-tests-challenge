import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";



describe("Get User balance", () => {


    let inMemoryUserRepository: InMemoryUsersRepository;
    let inMemoryStatementRepository: InMemoryStatementsRepository;
    let createStatementUseCase: CreateStatementUseCase;
    let createUserUseCase: CreateUserUseCase;
    let getBalanceUseCase: GetBalanceUseCase;

    beforeEach(() => {
        inMemoryStatementRepository = new InMemoryStatementsRepository();
        inMemoryUserRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUserRepository);
    });


    it("Should be able to get a User balance", async () => {
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

        const balance = await getBalanceUseCase.execute({
            user_id: user.id as string
        });

        expect(balance.statement.length).toBeGreaterThan(0);
    });

    it("Should be not be able to get a balance to inexistent user", () => {

        expect(async () => {
            const balance = await getBalanceUseCase.execute({
                user_id: "123444"
            });
        }).rejects.toBeInstanceOf(GetBalanceError);
    });
});