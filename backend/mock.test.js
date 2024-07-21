const dotenv = require('dotenv')
dotenv.config()


test('Simple test using env varibale', () => {
    const env_var = process.env.TEST_VAR
    console.log(env_var)
    expect(env_var).toBe('testing')
})