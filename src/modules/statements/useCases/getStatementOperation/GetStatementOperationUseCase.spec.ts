import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


describe("Get Statement Operation", () => {

    let inMemoryUserRepository: InMemoryUsersRepository;
    let inMemoryStatementRepository: InMemoryStatementsRepository;
    let createStatementUseCase: CreateStatementUseCase;
    let createUserUseCase: CreateUserUseCase;
    let getStatementOperationUseCase: GetStatementOperationUseCase;

    beforeEach(() => {
        inMemoryStatementRepository = new InMemoryStatementsRepository();
        inMemoryUserRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUserRepository, inMemoryStatementRepository);
    });

    it("Should be able to get a user statement operation", async() => {
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

        const operation = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string
        });

        expect(operation).toHaveProperty("id");
    });

    it("Should not be able to get a statement operation for inexistent user", () => {
        expect( async() => {
            const operation = await getStatementOperationUseCase.execute({
                user_id: "1132",
                statement_id: "4493"
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });


    it("Should not be able to get a statement operation for inexistent user", () => {
        expect( async() => {

            const user = await createUserUseCase.execute({
                name: "Test User",
                email: "test@test.com",
                password: "1234"
            });

            const operation = await getStatementOperationUseCase.execute({
                user_id: user.id as string,
                statement_id: "4493"
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });
});