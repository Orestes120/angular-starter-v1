import UserService from '../user.service';

describe('Users', () => {

    it('attemptAuth should exist', function() {
        let User = new UserService();
        expect(User.attemptAuth).toBeDefined();
    });
});