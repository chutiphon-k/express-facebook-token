import { Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from 'config'

const router = Router()

let getToken = (user) => {
	let { _id, username } = user
	let token = jwt.sign({ _id, username }, config.Api.secret, {
		expiresIn: 60 * 60 * 24 * 30
	})
	return token
}

router.get('/auth/facebook', passport.authenticate('facebook', { session: false }))

router.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
	res.json({success: true, token: `JWT ${getToken(req.user)}`})
})

export default router
