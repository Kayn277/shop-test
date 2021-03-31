import * as Jwt from 'passport-jwt'
import { getRepository } from 'typeorm'
import { User } from '../../users/entity/user.entity'

let options:Jwt.StrategyOptions = {
    jwtFromRequest: Jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: false
}

const JwtStrategy = new Jwt.Strategy(options, async (payload, done) => {
    var user = getRepository(User).findOne(payload.id);
    if(user) {
        return await done(null, user);
    }
    else {
        return await done(null, false);
    }
}) 

export default JwtStrategy;