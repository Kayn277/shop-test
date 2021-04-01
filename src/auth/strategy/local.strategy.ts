import {IStrategyOptions, Strategy, VerifyFunction} from 'passport-local';
import { getRepository } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import * as bcrypt from 'bcrypt';
let options:IStrategyOptions = {
    usernameField: 'login',
    passwordField: 'password',
    session: false
}

const LocalStrategy = new Strategy(options, async (username, password, done) => {
    let user: User = await getRepository(User).findOne({where: {login: username}});
    let checkBcrypt: boolean = await bcrypt.compare(password, user.password)
    if(checkBcrypt) {
        return done(null, user);
    }
    else {
        return done(null, false);
    }
})

export default LocalStrategy;