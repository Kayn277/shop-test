import {IStrategyOptions, Strategy, VerifyFunction} from 'passport-local';
import { getRepository } from 'typeorm';
import { User } from '../../users/entity/user.entity';

let options:IStrategyOptions = {
    usernameField: 'login',
    passwordField: 'password',
    session: false
}

const LocalStrategy = new Strategy(options, async (username, password, done) => {
    let user: User = await getRepository(User).findOne({where: {login: username}});
    if(user.password === password) {
        return done(null, user);
    }
    else {
        return done(null, false);
    }
})

export default LocalStrategy;