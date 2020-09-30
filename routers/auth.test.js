const auth = require('./auth');

describe('authentication logic', () => {
    it('authentication success', async () => {
        expect.assertions(1);
        const token = await auth.login("Ivan Ivanov", "12345");
        expect(token).toBeTruthy();
    });
    it('authentication failed', async () => {
        expect.assertions(1);
        const token = await auth.login("Ivan Ivanov", "");
        expect(token).toBeFalsy();
    });        
})
