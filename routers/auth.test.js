const auth = require('./auth');

test('login works', async (done) => {
    //expect.assertions(1);
    const token = await auth.login("Ivan Ivanov", "12345");
    expect(!!token.token).toBe(true);
    done();
});
