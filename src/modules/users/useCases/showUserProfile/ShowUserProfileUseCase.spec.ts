import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";



describe("Show User Profile", () => {

    let inMemoryUserRepository: InMemoryUsersRepository;
    let showUserProfileUseCase: ShowUserProfileUseCase;
    let createUserUseCase: CreateUserUseCase;

    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);    
        createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    });

    it("should be able to show a User Profile", async () => {
        const user = await createUserUseCase.execute({
            name: "Test Email",
            email: "test@test.com",
            password: "1234"
        });

        const profile = await showUserProfileUseCase.execute(user.id as string);

        expect(profile).toHaveProperty("id");
    });

    it("Should not be able to a inexisting user profile", () => {
        expect(async() => {
            const profile = await showUserProfileUseCase.execute("123");
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });

    
});