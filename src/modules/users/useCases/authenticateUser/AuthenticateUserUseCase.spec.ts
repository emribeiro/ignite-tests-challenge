import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";



describe("Authenticate User", () => {


    let inMemoryUserRepository : InMemoryUsersRepository;
    let authenticateUserUseCase : AuthenticateUserUseCase;
    let createUserUseCase: CreateUserUseCase;

    beforeEach( async () => {
        inMemoryUserRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);

        const user = await createUserUseCase.execute({
            name: "Test User",
            email: "test@test.com",
            password: "1235"
        });

    });

    it("should be able to authenticate a existing user", async () => {
        const response = await authenticateUserUseCase.execute({
            email: "test@test.com",
            password: "1235"
        });

        expect(response).toHaveProperty("token");
    })

    it("Should not be able to authenticate a inexisting user", () => {
        expect(async () => {
            const response = await authenticateUserUseCase.execute({
                email: "test2@test.com",
                password: "1235"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    })

    it("Should not be able to authenticate with a incorrect password", () => {
        expect(async () => {
            const response = await authenticateUserUseCase.execute({
                email: "test@test.com",
                password: "1236"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    })

    

});