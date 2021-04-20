import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


describe("Create User", ()=> {

    let inMemoryUserRepository: InMemoryUsersRepository;
    let createUserUseCase: CreateUserUseCase;

    beforeEach(() => {

        inMemoryUserRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);

    });


    it("should be able to create a new User", async () => {
        const user = await createUserUseCase.execute({
            name: "Test User",
            email: "test@test.com",
            password: "1234"
        })

        expect(user).toHaveProperty("id");
    })

    it("should not be able to create a new user with existing user email", async () => {
        const user = await createUserUseCase.execute({
            name: "Test User",
            email: "test@test.com",
            password: "1234"
        })

        expect(async () => {
            const user = await createUserUseCase.execute({
                name: "Test User",
                email: "test@test.com",
                password: "1234"
            })
        }).rejects.toBeInstanceOf(CreateUserError);


    });

});